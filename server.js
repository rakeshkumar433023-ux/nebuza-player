const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Server test
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Nebuza Backend",
    message: "Nebuza backend is running"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy"
  });
});

// Direct video URL validator
app.get("/api/video", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "Video URL is required"
    });
  }

  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({
      success: false,
      error: "Invalid URL"
    });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return res.status(400).json({
      success: false,
      error: "Only HTTP/HTTPS URLs are supported"
    });
  }

  const path = parsed.pathname.toLowerCase();

  const videoExtensions = [
    ".mp4",
    ".webm",
    ".mov",
    ".m4v",
    ".ogv"
  ];

  const isDirectVideo = videoExtensions.some(ext =>
    path.endsWith(ext)
  );

  if (!isDirectVideo) {
    return res.status(400).json({
      success: false,
      error: "This is not a direct video URL",
      message: "Use a direct video file URL such as .mp4 or .webm"
    });
  }

  res.json({
    success: true,
    type: "direct-video",
    videoUrl: url
  });
});

// Telegram webhook
app.post("/webhook", async (req, res) => {
  try {
    const update = req.body;

    console.log("Telegram update received:", JSON.stringify(update));

    if (update.channel_post) {
      const post = update.channel_post;

      const chatId = post.chat.id;
      const messageId = post.message_id;

      console.log("Channel post:", chatId, messageId);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(200);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Nebuza Backend running on port ${PORT}`);
});
