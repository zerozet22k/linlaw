"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Result, Button, Card } from "antd";

import apiClient from "@/utils/api/apiClient";
import SubLoader from "@/components/loaders/SubLoader";
import RelatedBusinessForm from "@/components/forms/RelatedBusinessForm";
import { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";

const EditRelatedBusinessPage: React.FC = () => {
  const [business, setBusiness] = useState<RelatedBusinessAPI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      const fetchBusiness = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await apiClient.get(`/related-businesses/id/${id}`);
          if (res.status === 200) {
            setBusiness(res.data);
          } else {
            setError("Failed to fetch related business details.");
          }
        } catch (e) {
          console.error("Error fetching related business:", e);
          setError("An error occurred while fetching related business details.");
        } finally {
          setLoading(false);
        }
      };

      fetchBusiness();
    } else {
      setError("Invalid ID.");
      setLoading(false);
    }
  }, [id]);

  return (
    <>
      {loading ? (
        <SubLoader tip="Loading related business details..." />
      ) : error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card>
            <Result
              status="error"
              title="Error"
              subTitle={error}
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard/related-businesses")}
                >
                  Back
                </Button>
              }
            />
          </Card>
        </div>
      ) : business ? (
        <RelatedBusinessForm business={business} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card>
            <Result
              status="warning"
              title="Not Found"
              subTitle="The item does not exist or has been removed."
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard/related-businesses")}
                >
                  Back
                </Button>
              }
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default EditRelatedBusinessPage;
