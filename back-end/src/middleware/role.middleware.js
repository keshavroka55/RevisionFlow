// only allow specific roles. 

export const allowRoles = (...roles) => {
    return (req, res, next) => {
        // console.log("=== ROLE CHECK ===");
        // console.log("Allowed roles:", roles);
        // console.log("User object:", req.user);
        // console.log("User role:", req.user?.role);
        // console.log("Role type:", typeof req.user?.role);
        // console.log("Includes?:", roles.includes(req.user?.role));
        // console.log("==================");

        if (!roles.includes(req.user?.role)) { // a fucking shit mistake : roles. 
            // console.log("Accessed denied here")
            return res.status(403).json({ message: "Access Denied." });
        }
        next();
    };
};