export const isUserAuthorized = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return false;
        }
        const payload = JSON.parse(atob(token.split(".")[1]));
        const parts = payload.argument.split('.');
        const role = parts[parts.length - 1];
        return role === "admin";
    };