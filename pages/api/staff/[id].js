import { Staff } from '../../../models/user';  

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'PUT':
            try {
                let staff = await Staff.findByPk(id);

                if (!staff) {о
                    staff = await Staff.create({
                        id,
                        ...req.body, 
                    });
                    return res.status(201).json(staff);  
                }

                await staff.update(req.body);
                return res.status(200).json(staff);

            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        
        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

