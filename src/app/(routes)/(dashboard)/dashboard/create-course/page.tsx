"use client";

import React, { useState, useTransition } from "react";

import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

import CoursePurpose from "./_components/course-purpose";
import CourseDetails from "./_components/course-details";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useCoursesContext } from "../../_contexts/courses-provider";

const CreateCourse = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { replace } = useRouter();
  const { fetchCourses } = useCoursesContext();

  const [generating, start] = useTransition();
  const [formData, setFormData] = useState([]);
  const [step, setStep] = useState(0);

  const handleUserInput = (fieldName: string, fieldValue: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const handleGenerateCourse = () => {
    start(async () => {
      try {
        const response = await axios.post("/api/course", {
          ...formData,
          email: user?.primaryEmailAddress?.emailAddress,
        });

        if (response.status === 201) {
          toast({
            title: response.statusText,
            description: response.data.message,
          });
          replace("/dashboard/courses");
          fetchCourses();
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: "destructive",
            title: error.response?.statusText,
            description: error.response?.data.message,
          });
        }
      }
    });
  };

  return (
    <section>
      <div className="max-w-[900px] w-full m-auto">
        <h2 className="text-4xl max-sm:text-3xl text-blue-500 text-center font-semibold mb-8">
          Create a New Course
        </h2>
        {step === 0 ? (
          <CoursePurpose
            setPurpose={(value: string) => handleUserInput("purpose", value)}
          />
        ) : (
          <CourseDetails
            setTopic={(value: string) => handleUserInput("topic", value)}
            setDifficultyLevel={(value: string) =>
              handleUserInput("difficultyLevel", value)
            }
          />
        )}

        <div
          className={`mt-8 flex ${
            step === 0 ? "justify-end" : "justify-between"
          }`}
        >
          {step !== 0 && (
            <>
              <Button onClick={() => setStep(step - 1)} disabled={generating}>
                Previous
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                aria-label={generating ? "Generating" : "Generate"}
                disabled={generating}
                onClick={handleGenerateCourse}
              >
                {generating ? (
                  <>
                    Generating <Loader className="animate-spin" />
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </>
          )}
          {step === 0 && (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreateCourse;
