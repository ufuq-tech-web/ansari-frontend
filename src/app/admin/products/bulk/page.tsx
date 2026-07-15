"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowLeft, Loader2, Play, Download, Image as ImageIcon } from "lucide-react";
import { adminApi } from "../../../../lib/admin-api";

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

  // Download Sample CSV helper
  const downloadSampleCSV = () => {
    const headers = "Name,SKU,Brand,Category,Subcategory,Price,SalePrice,Image,HoverImage,Stock,Colors,Sizes,Gender,AgeGroup,Badge,IsNew\n";
    const row1 = 'Ansari Premium Oxford,OX-100,Ansari,men,Dress Shoes,3999,3499,https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a,,IN_STOCK,"Black,Brown","7,8,9,10",UNISEX,,Best Seller,true\n';
    const row2 = 'Stride Athletic Sneaker,SN-200,Stride,women,Running Shoes,2499,1999,https://images.unsplash.com/photo-1549298916-b41d501d3772,,LOW_STOCK,"White,Blue","6,7,8",UNISEX,,New,false\n';
    const blob = new Blob([headers + row1 + row2], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ansari_products_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        if (header === "Price" || header === "Price" || header === "Price") rowObj.price = Number(val) || 0;
        else if (header === "SalePrice" || header === "salePrice") rowObj.salePrice = Number(val) || 0;
        else if (header === "Colors" || header === "colors") rowObj.colors = val ? val.split(";").map((c) => c.trim()) : [];
        else if (header === "Sizes" || header === "sizes") rowObj.sizes = val ? val.split(";").map((s) => s.trim()) : [];
        else if (header === "IsNew" || header === "isNew") rowObj.isNew = val.toLowerCase() === "true";
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

  // ZIP File select (Mock mapping simulation for SKU names)
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setZipFile(file);
    setIsValidated(false);

    // Simulate reading filenames in ZIP based on typical patterns
    // e.g., if SKU in CSV matches filename without extension, map it!
    const simulatedFiles = ["OX-100.jpg", "SN-200.png", "UNKNOWN-SKU.jpg"];
    setZipImages(simulatedFiles);
    setValidationLogs((prev) => [
      ...prev,
      { type: "success", message: `ZIP file loaded. Found ${simulatedFiles.length} images inside.` },
    ]);
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
      if (zipFile && zipImages.length > 0) {
        const matchingImage = zipImages.find(
          (imgName) => imgName.split(".")[0].toUpperCase() === row.sku.toUpperCase()
        );
        if (matchingImage) {
          // Simulated mapping URL
          updatedImage = `/uploads/products/${matchingImage}`;
          logs.push({
            type: "success",
            message: `Row ${idx + 1} ("${row.name}"): Mapped image "${matchingImage}" to SKU "${row.sku}".`,
          });
        } else {
          logs.push({
            type: "warning",
            message: `Row ${idx + 1} ("${row.name}"): No matching image file found in ZIP for SKU "${row.sku}". Using default fallback.`,
          });
        }
      }

      return {
        ...row,
        image: updatedImage,
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
        <button
          onClick={downloadSampleCSV}
          className="flex items-center gap-1.5 text-xs text-brand-orange font-poppins font-bold uppercase tracking-wider hover:gap-2 transition-all bg-brand-orange/5 hover:bg-brand-orange/10 px-4 py-2.5 rounded-xl border border-brand-orange/20"
        >
          <Download className="w-4 h-4" /> Download Sample CSV
        </button>
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
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-charcoal-200 hover:border-brand-orange rounded-2xl p-6 cursor-pointer bg-charcoal-50/50 hover:bg-brand-orange/5 transition-all text-center group">
            <Upload className="w-8 h-8 text-charcoal-400 group-hover:text-brand-orange mb-2.5 transition-colors" />
            <span className="text-xs font-poppins font-bold text-charcoal-700 uppercase tracking-wide">
              {zipFile ? zipFile.name : "Choose ZIP File"}
            </span>
            <span className="text-[10px] text-charcoal-400 font-inter mt-1">
              {zipFile ? `${(zipFile.size / 1024 / 1024).toFixed(1)} MB` : "Maps filenames directly to product SKUs"}
            </span>
            <input
              type="file"
              accept=".zip"
              onChange={handleZipChange}
              className="hidden"
            />
          </label>
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
