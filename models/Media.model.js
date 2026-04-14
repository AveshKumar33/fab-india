import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
    {
        asset_id: {
            type: String,
            required: true,
            trim: true,
        },
        public_id: {
            type: String,
            required: true,
            trim: true,
        },
        thumbnail_url: {
            type: String,
            required: true,
            trim: true,
        },
        path: {
            type: String,
            required: true,
            trim: true,
        },
        format: {
            type: String,
            required: true,
            trim: true,
        },
        alt: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Media =
    mongoose.models.Media || mongoose.model("Media", mediaSchema, "medias");
