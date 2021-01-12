import e from "express";
import m from '../data/moves.json';

const moves: any = m;
const router = e.Router();

// @desc Get a single move by id
// @route GET /api/moves/:id
// @access Public (for now)
router.get('/:id', (req, res) => {
    try {
        const result: any = moves[req.params.id];
        result ? res.json(result) : res.status(404).json(`Could not find move of id: ${req.params.id}`);
    } catch (err) {
        console.error();
        res.status(500).json({message: "Internal server error"});
    }
});

router.get('/team/:array', (req, res) => {
    try {
        const ids: string[] = req.params.array.split(",");
        let arr = [];
        for (const id of ids) {
            const move = moves[id];
            if (move) {
                arr.push(move);
            } else {
                res.status(404).json(`Could not find move of id: ${id}`);
                return;
            }
        }
        res.json(arr);
    } catch (err) {
        console.error();
        res.status(500).json({message: "Internal server error"});
    }
});

export default router;