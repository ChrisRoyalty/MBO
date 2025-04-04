import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SlugRedirect() {
  const { slug } = useParams(); // Get the slug from the URL
  const navigate = useNavigate(); // Hook to perform the redirection

  useEffect(() => {
    const fetchProfileBySlug = async () => {
      try {
        // Check if the profile exists for this slug
        const response = await axios.get(`/get-slug/${slug}`);
        if (response.data) {
          // If profile exists, redirect to the correct profile page
          navigate(`/community/profile/${slug}`, { replace: true });
        } else {
          // If profile doesn't exist, handle error (e.g., show a 404 page)
          console.error("Profile not found.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfileBySlug();
  }, [slug, navigate]);

  return <div>Redirecting...</div>;
}

export default SlugRedirect;
