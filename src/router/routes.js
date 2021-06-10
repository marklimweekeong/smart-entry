const routes = [
    { name: "index", path: "", component: () => import("pages/Index.vue") },
    { name: "scan", path: "/scan", component: () => import("pages/ScanQRCode.vue") },
    { name: "profile", path: "/profile", component: () => import("pages/Profile.vue") },
    { name: "tutorial", path: "/tutorial", component: () => import("pages/Tutorial.vue") },
    // { path: "/denied", component: () => import("pages/PermissionsDenied.vue") },
    // { path: "/testing", component: () => import("pages/Testing.vue") },

    // {
    //     path: "*",
    //     component: () => import("pages/Error404.vue")
    // }
];

export default routes;
