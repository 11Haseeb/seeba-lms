"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const useCourseMaterial = () => {
  const [loading, start] = useTransition();
  const { courseId } = useParams();
  const [materialData, setMaterialData] = useState<{
    notes: [];
    flashCards: [];
    quizes: [];
  }>({ notes: [], flashCards: [], quizes: [] });

  const fetchCourseMaterial = () => {
    start(async () => {
      const response = await axios.get(
        `/api/course-material?courseId=${courseId}`
      );
      const data = response.data.data;
      setMaterialData({
        notes: data.notes,
        flashCards: data.flashCards,
        quizes: data.quizes,
      });
    });
  };

  useEffect(() => {
    fetchCourseMaterial();
  }, [courseId]);

  return { materialData, loading, fetchCourseMaterial };
};

export default useCourseMaterial;
