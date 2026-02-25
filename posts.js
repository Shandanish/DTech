// ===== DANISH TECH - POSTS DATABASE =====
// Supports: software, video, image, document

const postsData = [
    // Software Post
    {
        id: 1,
        type: "software",
        title: "Safe Exam Browser",
        description: "Safe Exam Browser is a secure browser environment for taking online exams. It prevents students from accessing unauthorized resources during exams and ensures exam integrity.",
        image: "https://i0.wp.com/teltales.port.ac.uk/wp-content/uploads/2017/07/SEB.png?fit=676%2C451&ssl=1",
        downloadUrl: "https://www.mediafire.com/file/7rp602v8tl0m6lp/safe-exam-browser-3.10.1-installer.exe/file",
        version: "3.10.1",
        fileSize: "85 MB",
        platform: "Windows",
        category: "Education",
        date: "2024-01-15",
        featured: true,
        downloads: 15420,
        badge: "POPULAR"
    }
          
    // ===== VIDEO POST EXAMPLE =====
    // Uncomment and modify to add video posts:
    /*
    ,
    {
        id: 2,
        type: "video",
        title: "How to Install Safe Exam Browser",
        description: "Complete tutorial on how to download and install Safe Exam Browser on Windows. Step by step guide for beginners.",
        image: "https://i0.wp.com/teltales.port.ac.uk/wp-content/uploads/2017/07/SEB.png?fit=676%2C451&ssl=1",
        videoUrl: "https://www.youtube.com/watch?v=UgOizAhudsk",
        // OR for Vimeo: "https://vimeo.com/123456789"
        // OR for direct video: "https://example.com/video.mp4"
        duration: "10:25",
        category: "Tutorial",
        date: "2024-01-16",
        featured: true,
        views: 5430,
        badge: "NEW"
    }
    */
    
    // ===== HOW TO ADD POSTS =====
    
    // FOR SOFTWARE:
    /*
    ,
    {
        id: [next number],
        type: "software",
        title: "Software Name",
        description: "Description...",
        image: "thumbnail URL",
        downloadUrl: "download link",
        version: "1.0.0",
        fileSize: "50 MB",
        platform: "Windows",
        category: "Category",
        date: "YYYY-MM-DD",
        featured: true,
        downloads: 0,
        badge: "NEW"
    }
    */
    
    // FOR VIDEO:
    /*
    ,
    {
        id: [next number],
        type: "video",
        title: "Video Title",
        description: "Description...",
        image: "thumbnail URL",
        videoUrl: "YouTube/Vimeo/Direct URL",
        duration: "MM:SS",
        category: "Category",
        date: "YYYY-MM-DD",
        featured: true,
        views: 0,
        badge: "NEW"
    }
    */
];
