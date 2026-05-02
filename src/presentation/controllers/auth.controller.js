export default class AuthController {
    constructor({ authService }) {
        this.authService = authService;
    }

    register = async (req, res) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.log("Error en register:", error.message);
            res.status(400).json({ error: error.message });
        }
    };

    login = async (req, res) => {
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }
            const result = await this.authService.login(req.body);
            res.json(result);
        } catch (error) {
            console.log("Error en login:", error.message);
            res.status(401).json({ error: error.message });
        }
    };
}