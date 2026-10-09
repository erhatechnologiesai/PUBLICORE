"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { reviewService } from "@/services";
import { Manuscript } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function AssignedReviewsPage() {
  const [reviews, setReviews] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewService.getAssignedReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Assigned Peer Reviews</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active and archived manuscripts assigned to your double-blind scientific review queue.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <div className="space-y-3">
            {reviews.map((ms) => (
              <Card key={ms.id} hover className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{ms.code}</span>
                    <StatusBadge status={ms.status} />
                    <span className="text-xs text-slate-400">Due in 14 days</span>
                  </div>
                  <Link href={`/dashboard/reviewer/workspace/${ms.id}`}>
                    <h3 className="text-base font-bold text-navy-950 hover:text-cyan-700">
                      {ms.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-1">{ms.abstract}</p>
                </div>
                <Link href={`/dashboard/reviewer/workspace/${ms.id}`}>
                  <Button variant="teal" size="sm">
                    Enter Workspace <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

