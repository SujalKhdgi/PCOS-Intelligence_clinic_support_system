import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  TestTube,
  ScanLine,
  Upload,
  X,
  Loader2,
  FileImage,
  AlertCircle
} from "lucide-react";

interface PCOSFormData {
  patient_name: string;
  region: string;
  cycle_length_days: number;
  cycles_per_year: number;
  total_testosterone: number;
  shbg: number;
  fasting_insulin: number;
  fasting_glucose: number;
  tsh: number;
  prolactin: number;
  crp: number;
  follicle_count_left: number;
  follicle_count_right: number;
  ovarian_volume_left: number;
  ovarian_volume_right: number;
  ultrasound_image?: File;
}

interface PCOSFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

// Define required fields per tab
const PATIENT_FIELDS = ["patient_name", "region", "cycle_length_days", "cycles_per_year"];
const LAB_FIELDS = ["total_testosterone", "shbg", "fasting_insulin", "fasting_glucose", "tsh", "prolactin", "crp"];
const ULTRASOUND_FIELDS = ["follicle_count_left", "follicle_count_right", "ovarian_volume_left", "ovarian_volume_right"];

const PCOSForm = ({ onSubmit, isLoading }: PCOSFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [activeTab, setActiveTab] = useState("patient");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<PCOSFormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      setValue("ultrasound_image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };



  const onFormSubmit = (data: PCOSFormData) => {
    const formData = new FormData();

    // Convert form data to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    onSubmit(formData);
  };



  return (
    <form ref={formRef} onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="patient" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Patient Info</span>
          </TabsTrigger>
          <TabsTrigger value="labs" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="hidden sm:inline">Lab Values</span>
          </TabsTrigger>
          <TabsTrigger value="ultrasound" className="flex items-center gap-2">
            <ScanLine className="h-4 w-4" />
            <span className="hidden sm:inline">Ultrasound</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patient_name">Patient Name <span className="text-destructive">*</span></Label>
                <Controller
                  name="patient_name"
                  control={control}
                  rules={{ required: "Patient name is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="patient_name"
                        placeholder="Enter patient name"
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region <span className="text-destructive">*</span></Label>
                <Controller
                  name="region"
                  control={control}
                  rules={{ required: "Region is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="region"
                        placeholder="Enter region"
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle_length_days">Cycle Length (Days) <span className="text-destructive">*</span></Label>
                <Controller
                  name="cycle_length_days"
                  control={control}
                  rules={{ required: "Cycle length is required", min: { value: 1, message: "Must be at least 1" } }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="cycle_length_days"
                        type="number"
                        placeholder="e.g., 28"
                        min="1"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycles_per_year">Cycles Per Year <span className="text-destructive">*</span></Label>
                <Controller
                  name="cycles_per_year"
                  control={control}
                  rules={{ required: "Cycles per year is required", min: { value: 0, message: "Cannot be negative" } }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="cycles_per_year"
                        type="number"
                        placeholder="e.g., 12"
                        min="0"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TestTube className="h-5 w-5 text-primary" />
                Laboratory Values
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="total_testosterone">Total Testosterone (ng/dL) <span className="text-destructive">*</span></Label>
                <Controller
                  name="total_testosterone"
                  control={control}
                  rules={{ required: "Total testosterone is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="total_testosterone"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 45"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shbg">SHBG (nmol/L) <span className="text-destructive">*</span></Label>
                <Controller
                  name="shbg"
                  control={control}
                  rules={{ required: "SHBG is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="shbg"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 40"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fasting_insulin">Fasting Insulin (μIU/mL) <span className="text-destructive">*</span></Label>
                <Controller
                  name="fasting_insulin"
                  control={control}
                  rules={{ required: "Fasting insulin is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="fasting_insulin"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 10"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fasting_glucose">Fasting Glucose (mg/dL) <span className="text-destructive">*</span></Label>
                <Controller
                  name="fasting_glucose"
                  control={control}
                  rules={{ required: "Fasting glucose is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="fasting_glucose"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 90"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tsh">TSH (mIU/L) <span className="text-destructive">*</span></Label>
                <Controller
                  name="tsh"
                  control={control}
                  rules={{ required: "TSH is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="tsh"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 2.5"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prolactin">Prolactin (ng/mL) <span className="text-destructive">*</span></Label>
                <Controller
                  name="prolactin"
                  control={control}
                  rules={{ required: "Prolactin is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="prolactin"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 15"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crp">CRP (mg/L) <span className="text-destructive">*</span></Label>
                <Controller
                  name="crp"
                  control={control}
                  rules={{ required: "CRP is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="crp"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 1.0"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className={fieldState.error ? "border-destructive" : ""}
                      />
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ultrasound">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ScanLine className="h-5 w-5 text-primary" />
                Ultrasound Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Left Ovary</h4>
                  <div className="space-y-2">
                    <Label htmlFor="follicle_count_left">Follicle Count <span className="text-destructive">*</span></Label>
                    <Controller
                      name="follicle_count_left"
                      control={control}
                      rules={{ required: "Left follicle count is required" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            {...field}
                            id="follicle_count_left"
                            type="number"
                            placeholder="e.g., 12"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className={fieldState.error ? "border-destructive" : ""}
                          />
                          {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                        </>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ovarian_volume_left">Ovarian Volume (mL) <span className="text-destructive">*</span></Label>
                    <Controller
                      name="ovarian_volume_left"
                      control={control}
                      rules={{ required: "Left ovarian volume is required" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            {...field}
                            id="ovarian_volume_left"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 8.5"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className={fieldState.error ? "border-destructive" : ""}
                          />
                          {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Right Ovary</h4>
                  <div className="space-y-2">
                    <Label htmlFor="follicle_count_right">Follicle Count <span className="text-destructive">*</span></Label>
                    <Controller
                      name="follicle_count_right"
                      control={control}
                      rules={{ required: "Right follicle count is required" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            {...field}
                            id="follicle_count_right"
                            type="number"
                            placeholder="e.g., 10"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className={fieldState.error ? "border-destructive" : ""}
                          />
                          {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                        </>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ovarian_volume_right">Ovarian Volume (mL) <span className="text-destructive">*</span></Label>
                    <Controller
                      name="ovarian_volume_right"
                      control={control}
                      rules={{ required: "Right ovarian volume is required" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            {...field}
                            id="ovarian_volume_right"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 9.0"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className={fieldState.error ? "border-destructive" : ""}
                          />
                          {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Ultrasound Image Upload</Label>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Ultrasound preview"
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="mt-3 text-sm text-muted-foreground">{imageName}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileImage className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Click to upload ultrasound image</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports JPG, PNG (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="ultrasound_image"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-5 w-5" />
            Submit for Diagnosis
          </>
        )}
      </Button>
    </form>
  );
};

export default PCOSForm;
