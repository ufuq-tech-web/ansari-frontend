"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowLeft, Loader2, Play, Download, Image as ImageIcon, HelpCircle } from "lucide-react";
import { adminApi } from "../../../../lib/admin-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const BACKEND_ORIGIN = API_URL.replace(/\/api\/?$/, "");

interface CSVRow {
  name: string;
  sku: string;
  brandName: string;
  categoryKey: string;
  subcategoryName?: string;
  price: number;
  salePrice: number;
  image: string;
  hoverImage?: string;
  gallery?: string[];
  stock?: string;
  colors?: string[];
  sizes?: string[];
  gender?: string;
  ageGroup?: string;
  badge?: string;
  isNew?: boolean;
}

interface ValidationLog {
  type: "success" | "error" | "warning";
  message: string;
}

export default function AdminBulkUploadPage() {
  const router = useRouter();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [zipImages, setZipImages] = useState<string[]>([]); // file names in ZIP
  const [validationLogs, setValidationLogs] = useState<ValidationLog[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ successCount: number; errorCount: number } | null>(null);
  const [uploadingZip, setUploadingZip] = useState(false);


  // CSV parsing logic
  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setIsValidated(false);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    if (lines.length <= 1) {
      setValidationLogs([{ type: "error", message: "CSV file is empty or missing headers." }]);
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
    const rows: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Split by commas, handling simple quotes
      const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) => v.trim().replace(/^["']|["']$/g, ""));
      if (values.length < headers.length) continue;

      const rowObj: any = {};
      headers.forEach((header, index) => {
        const val = values[index];
        const h = header.toLowerCase();
        
        if (h === "price") rowObj.price = Number(val) || 0;
        else if (h === "saleprice") rowObj.salePrice = Number(val) || 0;
        else if (h === "colors") rowObj.colors = val ? val.split(";").map((c) => c.trim()) : [];
        else if (h === "sizes") rowObj.sizes = val ? val.split(";").map((s) => s.trim()) : [];
        else if (h === "isnew") rowObj.isNew = val.toLowerCase() === "true";
        else if (h === "sku") rowObj.sku = val;
        else if (h === "brand") rowObj.brandName = val;
        else if (h === "category") rowObj.categoryKey = val;
        else if (h === "subcategory") rowObj.subcategoryName = val;
        else {
          const key = header.charAt(0).toLowerCase() + header.slice(1);
          rowObj[key] = val;
        }
      });
      rows.push(rowObj as CSVRow);
    }
    setParsedData(rows);
    setValidationLogs([{ type: "success", message: `Successfully parsed ${rows.length} products from CSV.` }]);
  };

  // ZIP file select — actually uploads and extracts on the backend, then maps
  // real extracted filenames to CSV rows by SKU during validation below.
  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setZipFile(file);
    setIsValidated(false);
    setUploadingZip(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminApi.upload<{ files: string[]; baseUrl: string }>("/products/bulk/upload-images", formData);
      setZipImages(res.files);
      setValidationLogs((prev) => [
        ...prev,
        { type: "success", message: `ZIP uploaded and extracted. Found ${res.files.length} image files inside.` },
      ]);
    } catch (err) {
      setZipImages([]);
      setValidationLogs((prev) => [
        ...prev,
        { type: "error", message: err instanceof Error ? `ZIP upload failed: ${err.message}` : "ZIP upload failed." },
      ]);
    } finally {
      setUploadingZip(false);
    }
  };

  // Validate mapping and categories
  const runValidation = () => {
    if (parsedData.length === 0) return;
    const logs: ValidationLog[] = [];
    let errorsCount = 0;

    const validatedRows = parsedData.map((row, idx) => {
      // Required check
      if (!row.name || !row.sku || !row.brandName || !row.categoryKey || row.price == null) {
        logs.push({
          type: "error",
          message: `Row ${idx + 1}: Missing required fields (Name, SKU, Brand, Category, Price).`,
        });
        errorsCount++;
      }

      // Category check (men, women, kids, accessories)
      const validCategories = ["men", "women", "kids", "accessories"];
      if (row.categoryKey && !validCategories.includes(row.categoryKey.toLowerCase())) {
        logs.push({
          type: "error",
          message: `Row ${idx + 1} ("${row.name}"): Category "${row.categoryKey}" is invalid. Expected one of: men, women, kids, accessories.`,
        });
        errorsCount++;
      }

      // SKU-based ZIP image mapping
      let updatedImage = row.image;
      let hoverImage = row.hoverImage;
      let gallery: string[] = [];

      if (zipFile && zipImages.length > 0) {
        // Find all images that start with the SKU (e.g. OX-100.jpg, OX-100-1.jpg, OX-100_2.png)
        const matchingImages = zipImages
          .filter((imgName) => {
            const upperImg = imgName.toUpperCase();
            const upperSku = row.sku.toUpperCase();
            return (
              upperImg.startsWith(upperSku + ".") ||
              upperImg.startsWith(upperSku + "-") ||
              upperImg.startsWith(upperSku + "_")
            );
          })
          .sort(); // Sorts -1, -2, etc.

        if (matchingImages.length > 0) {
          gallery = matchingImages.map((img) => `${BACKEND_ORIGIN}/uploads/products/${img}`);
          updatedImage = gallery[0];
          hoverImage = gallery.length > 1 ? gallery[1] : updatedImage;

          logs.push({
            type: "success",
            message: `Row ${idx + 1} ("${row.name}"): Mapped ${matchingImages.length} image(s) to SKU "${row.sku}".`,
          });
        } else {
          logs.push({
            type: "warning",
            message: `Row ${idx + 1} ("${row.name}"): No matching image files found in ZIP for SKU "${row.sku}". Using default fallback.`,
          });
        }
      }

      return {
        ...row,
        image: updatedImage,
        hoverImage: hoverImage || updatedImage,
        gallery,
      };
    });

    if (errorsCount === 0) {
      logs.push({
        type: "success",
        message: "All validation checks passed! Products are ready for import.",
      });
      setParsedData(validatedRows);
      setIsValidated(true);
    } else {
      logs.push({
        type: "error",
        message: `Validation failed with ${errorsCount} blocking errors. Please fix your CSV and re-upload.`,
      });
      setIsValidated(false);
    }

    setValidationLogs((prev) => [...prev, ...logs]);
  };

  // Run import in backend
  const executeImport = async () => {
    if (!isValidated || parsedData.length === 0) return;
    setImporting(true);
    try {
      // Map frontend keys to DTO model
      const batchPayload = parsedData.map((row) => ({
        name: row.name,
        sku: row.sku,
        brandName: row.brandName,
        categoryKey: row.categoryKey.toLowerCase(),
        subcategoryName: row.subcategoryName,
        price: Number(row.price),
        salePrice: Number(row.salePrice || row.price),
        image: row.image || "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400",
        hoverImage: row.hoverImage || row.image,
        gallery: row.gallery || [],
        stock: row.stock || "IN_STOCK",
        isNew: !!row.isNew,
        colors: row.colors || [],
        sizes: row.sizes || [],
        badge: row.badge,
      }));

      const res = await adminApi.post<{ successCount: number; errorCount: number; errors: any[] }>(
        "/products/bulk",
        batchPayload
      );

      // Log activity to backend activity log
      await adminApi.post("/users/admin/logs", {
        action: "BULK_IMPORT",
        details: `Imported ${res.successCount} products successfully. Failed rows: ${res.errorCount}. CSV: ${csvFile?.name}`,
      });

      setImportResult({
        successCount: res.successCount,
        errorCount: res.errorCount,
      });

      if (res.errors && res.errors.length > 0) {
        setValidationLogs((prev) => [
          ...prev,
          ...res.errors.map((err) => ({
            type: "error" as const,
            message: `Backend Error - Row ${err.index + 1} ("${err.name}"): ${err.error}`,
          })),
        ]);
      }
    } catch (err) {
      console.error(err);
      setValidationLogs((prev) => [
        ...prev,
        { type: "error", message: "Failed to execute bulk upload in the database." },
      ]);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/products" className="flex items-center gap-1.5 text-xs text-charcoal-400 font-poppins font-bold uppercase tracking-wider hover:text-brand-orange transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight">Bulk Upload Products</h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
            Import shoes and catalog items using CSV files and ZIP images matching SKUs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/ansari_products_template.csv"
            download="ansari_products_template.csv"
            className="flex items-center gap-1.5 text-xs text-brand-orange font-poppins font-bold uppercase tracking-wider hover:gap-2 transition-all bg-brand-orange/5 hover:bg-brand-orange/10 px-4 py-2.5 rounded-xl border border-brand-orange/20"
          >
            <Download className="w-4 h-4" /> Download Sample CSV
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        
        {/* CSV File Input */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-sm">
          <h3 className="font-poppins font-bold text-charcoal-900 text-sm mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-orange" />
            1. Select CSV Spreadsheet
          </h3>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-charcoal-200 hover:border-brand-orange rounded-2xl p-6 cursor-pointer bg-charcoal-50/50 hover:bg-brand-orange/5 transition-all text-center group">
            <Upload className="w-8 h-8 text-charcoal-400 group-hover:text-brand-orange mb-2.5 transition-colors" />
            <span className="text-xs font-poppins font-bold text-charcoal-700 uppercase tracking-wide">
              {csvFile ? csvFile.name : "Choose CSV File"}
            </span>
            <span className="text-[10px] text-charcoal-400 font-inter mt-1">
              {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : "Drag and drop or browse files"}
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvChange}
              className="hidden"
            />
          </label>
        </div>

        {/* ZIP Images Input */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-sm">
          <h3 className="font-poppins font-bold text-charcoal-900 text-sm mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-orange" />
            2. Select Images ZIP Archive
          </h3>
          <label className={`flex flex-col items-center justify-center border-2 border-dashed border-charcoal-200 hover:border-brand-orange rounded-2xl p-6 cursor-pointer bg-charcoal-50/50 hover:bg-brand-orange/5 transition-all text-center group ${uploadingZip ? "opacity-60 pointer-events-none" : ""}`}>
            {uploadingZip ? (
              <Loader2 className="w-8 h-8 text-brand-orange mb-2.5 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-charcoal-400 group-hover:text-brand-orange mb-2.5 transition-colors" />
            )}
            <span className="text-xs font-poppins font-bold text-charcoal-700 uppercase tracking-wide">
              {uploadingZip ? "Uploading & extracting…" : zipFile ? zipFile.name : "Choose ZIP File"}
            </span>
            <span className="text-[10px] text-charcoal-400 font-inter mt-1">
              {zipFile && !uploadingZip ? `${zipImages.length} images extracted` : "Maps filenames directly to product SKUs"}
            </span>
            <input
              type="file"
              accept=".zip"
              onChange={handleZipChange}
              disabled={uploadingZip}
              className="hidden"
            />
          </label>
        </div>

      </div>

      <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-poppins font-bold text-charcoal-900 text-sm flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-brand-orange" /> Detailed Import Instructions
        </h3>
        <div className="text-xs text-charcoal-700 font-inter space-y-3 leading-relaxed">
          <p><strong>1. Excel/CSV Format:</strong> Ensure your document matches the column headers of the sample exactly. Mandatory fields include <code>Name</code>, <code>SKU</code>, <code>Brand</code>, <code>Category</code>, and <code>Price</code>.</p>
          <p><strong>2. Categories & Subcategories:</strong> The category must be one of: <code>men</code>, <code>women</code>, <code>kids</code>, or <code>accessories</code>. The subcategory must exactly match the ones existing in your store (e.g., <code>Sneakers</code>, <code>Formal Shoes</code>, <code>Boots</code>).</p>
          <p><strong>3. Multi-Image ZIP Mapping (Important!):</strong> For automatic gallery mapping, name the files inside your ZIP using the exact <strong>SKU</strong> followed by a dash and number.
            For example, if your product SKU is <strong>SN-200</strong>, name your images:
            <br />• <code>SN-200-1.jpg</code> (Main Thumbnail)
            <br />• <code>SN-200-2.jpg</code> (Hover Image)
            <br />• <code>SN-200-3.jpg</code> (Gallery Image)
          </p>
        </div>
      </div>

      {/* Action panel */}
      {parsedData.length > 0 && (
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="leading-snug">
            <h4 className="font-poppins font-bold text-charcoal-900 text-sm">Review & Validation</h4>
            <p className="text-xs text-charcoal-450 font-inter mt-0.5">
              Ready to validate {parsedData.length} records.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={runValidation}
              className="flex items-center gap-2 bg-charcoal-900 text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-charcoal-800 transition-colors"
            >
              <Play className="w-4 h-4" /> Run Validation Tests
            </button>
            {isValidated && (
              <button
                onClick={executeImport}
                disabled={importing || importResult !== null}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-brand-orange/20 transition-all disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Importing…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Execute Import
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Validation / Execution Logs */}
      {validationLogs.length > 0 && (
        <div className="bg-white rounded-2xl border border-charcoal-200 overflow-hidden shadow-sm mb-6">
          <div className="px-5 py-4 border-b border-charcoal-150 bg-charcoal-50 flex items-center justify-between">
            <h3 className="font-poppins font-bold text-charcoal-800 text-xs tracking-wider uppercase">Import Validation & Run Logs</h3>
            <button
              onClick={() => setValidationLogs([])}
              className="text-[10px] text-charcoal-400 font-poppins font-semibold uppercase tracking-wider hover:text-brand-orange"
            >
              Clear Logs
            </button>
          </div>
          <div className="p-5 font-mono text-xs max-h-60 overflow-y-auto flex flex-col gap-2 bg-charcoal-900 text-charcoal-100">
            {validationLogs.map((log, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 leading-relaxed ${
                  log.type === "success"
                    ? "text-emerald-400"
                    : log.type === "error"
                      ? "text-rose-400"
                      : "text-amber-400"
                }`}
              >
                {log.type === "success" && <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />}
                {log.type === "error" && <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />}
                {log.type === "warning" && <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />}
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import Result Summary Card */}
      {importResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 flex-shrink-0 animate-bounce" />
          <div>
            <h4 className="font-poppins font-bold text-emerald-900 text-base">Bulk Import Complete!</h4>
            <p className="text-xs text-emerald-700 font-inter mt-1">
              Successfully created <span className="font-bold">{importResult.successCount}</span> products in the store catalog. 
              {importResult.errorCount > 0 && (
                <span> There were <span className="font-bold text-rose-600">{importResult.errorCount}</span> errors logged.</span>
              )}
            </p>
            <button
              onClick={() => router.push("/admin/products")}
              className="mt-3 bg-emerald-600 text-white font-poppins font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-emerald-750 transition-colors"
            >
              Go to Product Catalog
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
