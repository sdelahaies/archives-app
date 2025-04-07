import jwt from "jsonwebtoken";

export async function POST(req) {
    const body = await req.json();
    const { username, password } = body;
    if (username === `${process.env.ADMIN_USERNAME}` && password === `${process.env.ADMIN_PASSWORD}`) {
        const argument = `${username}.admin`
        const token = jwt.sign({ argument }, `${process.env.SECRET_KEY}`, { expiresIn: "1h" });
        return new Response(JSON.stringify({ token }), { status: 200 });
    } else {
        return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }
}
