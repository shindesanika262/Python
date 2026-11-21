
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  ArrowLeft,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  Loader2,
  LockKeyhole,
  IdCard,
} from "lucide-react";

const API_URL = "http://localhost:3000/api/users";

type Details = Record<string, unknown>;

type SectionProps = {
  title: string;
  data: Details | null;
  icon: React.ReactNode;
  color: string;
  excludeKeys?: string[];
};

function getRecord(data: Details | null): Details | null {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  let record: unknown = data;

  if (
    typeof record === "object" &&
    record !== null &&
    !Array.isArray(record) &&
    "data" in record
  ) {
    record = record.data;
  }

  if (Array.isArray(record)) {
    record = record[0];
  }

  return record &&
    typeof record === "object" &&
    !Array.isArray(record)
    ? (record as Details)
    : null;
}

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function DetailSection({
  title,
  data,
  icon,
  color,
  excludeKeys = [],
}: SectionProps) {
  const record = getRecord(data);

  const entries = record
    ? Object.entries(record).filter(
        ([key, value]) =>
          !excludeKeys.includes(key.toLowerCase()) &&
          value !== null &&
          value !== undefined &&
          typeof value !== "object"
      )
    : [];

  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader
        className={`${color} border-b border-slate-100 py-4`}
      >
        <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-800">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            {icon}
          </span>

          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5">
        {entries.length > 0 ? (
          <div className="space-y-0">
            {entries.map(([key, value], index) => (
              <div
                key={key}
                className={`grid grid-cols-1 gap-1 py-3 sm:grid-cols-[minmax(100px,0.8fr)_minmax(0,1.2fr)] sm:gap-4 ${
                  index !== entries.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <span className="text-sm text-slate-500">
                  {formatLabel(key)}
                </span>

                <span className="break-words text-sm font-medium text-slate-800">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-500">
              No information available.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function StudentDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [personal, setPersonal] = useState<Details | null>(null);
  const [academic, setAcademic] = useState<Details | null>(null);
  const [professional, setProfessional] =
    useState<Details | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("Student ID is missing.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchDetails() {
      try {
        setLoading(true);
        setError("");

        const endpoints = [
          `${API_URL}/${encodeURIComponent(userId)}/personal`,
          `${API_URL}/${encodeURIComponent(userId)}/academic`,
          `${API_URL}/${encodeURIComponent(userId)}/professional`,
        ];

        const responses = await Promise.all(
          endpoints.map((url) =>
            fetch(url, { signal: controller.signal })
          )
        );

        const failedResponse = responses.find(
          (response) => !response.ok
        );

        if (failedResponse) {
          throw new Error(
            `Unable to load student details (HTTP ${failedResponse.status}).`
          );
        }

        const [
          personalData,
          academicData,
          professionalData,
        ] = await Promise.all(
          responses.map((response) => response.json())
        );

        setPersonal(personalData);
        setAcademic(academicData);
        setProfessional(professionalData);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error("Error loading student details:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load student details."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDetails();

    return () => controller.abort();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-red-600" />

        <span className="text-sm font-medium text-slate-600">
          Loading student details...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 p-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>

        <Card className="border-red-200">
          <CardContent className="space-y-3 p-6">
            <h2 className="font-semibold text-red-600">
              Unable to Load Student Details
            </h2>

            <p className="text-sm text-slate-600">
              {error}
            </p>

            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const personalRecord = getRecord(personal);

  const displayName =
    personalRecord?.full_name ??
    personalRecord?.fullName ??
    personalRecord?.name ??
    (
      [
        personalRecord?.first_name ??
          personalRecord?.firstName,
        personalRecord?.last_name ??
          personalRecord?.lastName,
      ]
        .filter(Boolean)
        .join(" ") || `Student ${userId}`
    );

  return (
    <main className="min-h-screen bg-slate-50/80 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="outline"
            className="border-slate-200 bg-white shadow-sm hover:bg-red-50 hover:text-red-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>

          <Badge
            variant="outline"
            className="gap-2 rounded-full border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700"
          >
            <LockKeyhole className="h-3.5 w-3.5" />
            Read Only
          </Badge>
        </div>

        {/* Student Header */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-red-600 via-rose-500 to-purple-500" />

          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-md">
                <UserRound className="h-8 w-8" />
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-red-600">
                  STUDENT PROFILE
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {String(displayName)}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  User ID: {userId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700">
                <IdCard className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Student Details
                </p>

                <p className="text-xs text-slate-500">
                  Personal · Academic · Professional
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Personal Information */}
          <div className="flex items-center gap-4 rounded-xl border border-red-100 bg-red-50/70 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <UserRound className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600">
                Personal Information
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Basic details and contact
              </p>
            </div>
          </div>

          {/* Academic Information */}
          <div className="flex items-center gap-4 rounded-xl border border-purple-100 bg-purple-50/70 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600">
                Academic Information
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Education and qualifications
              </p>
            </div>
          </div>

          {/* Professional Information */}
          <div className="flex items-center gap-4 rounded-xl border border-emerald-100 bg-emerald-50/70 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600">
                Professional Information
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Employment and skills
              </p>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">

          <DetailSection
            title="Personal Information"
            data={personal}
            icon={
              <UserRound className="h-5 w-5 text-red-600" />
            }
            color="bg-red-50/80"
            excludeKeys={["id", "user_id", "userid"]}
          />

          <DetailSection
            title="Academic Information"
            data={academic}
            icon={
              <GraduationCap className="h-5 w-5 text-purple-600" />
            }
            color="bg-purple-50/80"
            excludeKeys={["id", "user_id", "userid"]}
          />

          <DetailSection
            title="Professional Information"
            data={professional}
            icon={
              <BriefcaseBusiness className="h-5 w-5 text-emerald-600" />
            }
            color="bg-emerald-50/80"
            excludeKeys={["id", "user_id", "userid"]}
          />

        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 py-3 text-center text-xs text-slate-400">
          <LockKeyhole className="h-3.5 w-3.5" />

          This profile is displayed in read-only mode.
        </div>

      </div>
    </main>
  );
}

