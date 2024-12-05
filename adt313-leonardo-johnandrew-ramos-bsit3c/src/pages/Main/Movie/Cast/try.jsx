import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateVideo = () => {
    const [video, setVideo] = useState({
        movieId: "",
        name: "",
        url: "",
        site: "",
        videoKey: "",
        videoType: "",
        official: false,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const [id] = useState(3);  // Assuming you're using React Router to pass the video id in the URL.

    // Fetch video data when component mounts
    useEffect(() => {
        const fetchVideoData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/videos/${id}`);
                setVideo(response.data);
            } catch (error) {
                console.error("Error fetching video data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
    }, [id]);

    // Handle form field change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVideo({
            ...video,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Handle video update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors([]);
        try {
            // Send the updated video details to the server
            const response = await axios.patch(`/videos/${id}`, video, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    Accept: "application/json",
                },
            });
            alert("Video updated successfully!");
            navigate(`/videos/${id}`);  // Redirect to the updated video details page
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors); // Display validation errors
            } else {
                console.error("Error updating video:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Update Video</h2>
            {errors.length > 0 && (
                <div style={{ color: "red" }}>
                    <ul>
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Movie ID:</label>
                    <input
                        type="text"
                        name="movieId"
                        value={video.movieId}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Video Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={video.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Video URL:</label>
                    <input
                        type="text"
                        name="url"
                        value={video.url}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Site:</label>
                    <input
                        type="text"
                        name="site"
                        value={video.site}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Video Key:</label>
                    <input
                        type="text"
                        name="videoKey"
                        value={video.videoKey}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Video Type:</label>
                    <input
                        type="text"
                        name="videoType"
                        value={video.videoType}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Official:</label>
                    <input
                        type="checkbox"
                        name="official"
                        checked={video.official}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Video</button>
            </form>
        </div>
    );
};

export default UpdateVideo;
