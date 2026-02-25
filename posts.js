// ===== POSTS DATABASE =====
// Add your posts here. This is your content database.
// Just copy and paste new post objects to add content.

const postsData = [
    // ===== EXAMPLE POSTS - Replace with your own =====
    
    {
        id: 1,
        type: "image",
        title: "Futuristic City Concept Art",
        description: "Amazing concept art of a cyberpunk city in 2050. High resolution digital artwork perfect for wallpapers and inspiration.",
        image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
        file: "uploads/images/city-concept.jpg",
        date: "2024-01-15",
        views: 1250,
        downloads: 340,
        category: "artwork"
    },
    {
        id: 2,
        type: "video",
        title: "AR Development Tutorial",
        description: "Complete guide to building augmented reality applications. Learn step by step how to create immersive AR experiences.",
        image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800",
        file: "uploads/videos/ar-tutorial.mp4",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        date: "2024-01-14",
        views: 3400,
        downloads: 890,
        category: "tutorial"
    },
    {
        id: 3,
        type: "document",
        title: "AI Research Paper 2024",
        description: "Comprehensive research paper on artificial intelligence advancements. Includes latest findings and future predictions.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        file: "uploads/documents/ai-research.pdf",
        fileSize: "2.5 MB",
        fileType: "PDF",
        date: "2024-01-13",
        views: 2100,
        downloads: 567,
        category: "research"
    },
    {
        id: 4,
        type: "software",
        title: "NexusAR Pro v2.5",
        description: "Professional augmented reality software with advanced tracking and 3D rendering. Windows compatible.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        file: "uploads/software/nexusar-pro.zip",
        fileSize: "156 MB",
        platform: "Windows",
        version: "2.5.0",
        date: "2024-01-12",
        views: 5600,
        downloads: 1234,
        category: "ar-software"
    },
    {
        id: 5,
        type: "image",
        title: "Neon Abstract Collection",
        description: "Collection of neon abstract art pieces. Perfect for digital projects and creative inspiration.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
        file: "uploads/images/neon-collection.zip",
        date: "2024-01-11",
        views: 890,
        downloads: 234,
        category: "artwork"
    },
    {
        id: 6,
        type: "document",
        title: "Startup Business Plan Template",
        description: "Professional business plan template for tech startups. Includes financial projections and market analysis sections.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        file: "uploads/documents/business-plan.pptx",
        fileSize: "5.2 MB",
        fileType: "PowerPoint",
        date: "2024-01-10",
        views: 1560,
        downloads: 423,
        category: "business"
    },
    {
        id: 7,
        type: "software",
        title: "Mobile AR Scanner",
        description: "Scan real-world objects and create AR models instantly. Android APK for AR development.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
        file: "uploads/software/ar-scanner.apk",
        fileSize: "45 MB",
        platform: "Android",
        version: "1.2.0",
        date: "2024-01-09",
        views: 3200,
        downloads: 876,
        category: "mobile-app"
    },
    {
        id: 8,
        type: "video",
        title: "3D Modeling Masterclass",
        description: "Learn professional 3D modeling techniques. Complete course from beginner to advanced level.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
        file: "uploads/videos/3d-masterclass.mp4",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        date: "2024-01-08",
        views: 4500,
        downloads: 1100,
        category: "tutorial"
    }
];

// ===== HOW TO ADD NEW POSTS =====
// Copy the template below and fill in your details:

/*
    {
        id: [next number],
        type: "image" OR "video" OR "document" OR "software",
        title: "Your Post Title",
        description: "Description of your post...",
        image: "uploads/images/your-thumbnail.jpg",
        file: "uploads/[type]/your-file.ext",
        date: "YYYY-MM-DD",
        views: 0,
        downloads: 0,
        category: "your-category"
    },
*/

// For videos, add: videoUrl: "https://youtube.com/embed/..."
// For documents, add: fileSize: "X MB", fileType: "PDF/DOCX/PPTX"
// For software, add: fileSize: "X MB", platform: "Windows/Android/Mac", version: "X.X.X"
