"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Result } from "antd";

import CareerForm from "@/components/forms/CareerForm";
import SubLoader from "@/components/loaders/SubLoader";
import apiClient from "@/utils/api/apiClient";
import type { CareerAPI } from "@/models/CareerModel";

const EditCareerPage: React.FC = () => {
  const [career, setCareer] = useState<CareerAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const careerId = params?.careerId;

  useEffect(() => {
    if (!careerId) {
      setError("Invalid career ID.");
      setLoading(false);
      return;
    }

    const fetchCareer = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/careers/${careerId}`);
        setCareer(response.data);
      } catch (error) {
        console.error("Error fetching career:", error);
        setError("An error occurred while fetching career details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [careerId]);

  if (loading) {
    return <SubLoader tip="Loading career details..." />;
  }

  if (error) {
    return (
      <div style={{ padding: "16px" }}>
        <Card>
          <Result
            status="error"
            title="Error"
            subTitle={error}
            extra={
              <Button type="primary" onClick={() => router.push("/dashboard/careers")}>
                Back to Careers
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  if (!career) {
    return (
      <div style={{ padding: "16px" }}>
        <Card>
          <Result
            status="warning"
            title="No Career Found"
            subTitle="The career entry does not exist or has been removed."
            extra={
              <Button type="primary" onClick={() => router.push("/dashboard/careers")}>
                Back to Careers
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return <CareerForm career={career} />;
};

export default EditCareerPage;
