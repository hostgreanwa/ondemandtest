import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

interface WeatherData {
    message?: string;
    main?: {
        temp: number;
        humidity: number;
    };
}

const app = express();
const API_KEY = '65c30b3194d7c141789fc9f4789c59e2';

app.get('/weather/:postcode', async (req: Request, res: Response) => {
    try {
        const postcode: string = req.params.postcode;
        const countryCode: string = 'TH';
        const apiUrl: string = `https://api.openweathermap.org/data/2.5/weather?zip=${postcode},${countryCode}&appid=${API_KEY}&units=metric`;

        const response = await fetch(apiUrl);
        const data: WeatherData = await response.json();

        if (response.ok) {
            if (data.main) {
                res.json(data);
            } else {
                res.status(500).json({ message: 'Data structure from API is invalid' });
            }
        } else {
            res.status(response.status).json({ message: data.message || 'Unknown error' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
