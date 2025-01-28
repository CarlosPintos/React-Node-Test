const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const result = new MeetingHistory({ ...req.body });
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to create a Meeting:", err);
        res.status(400).json({ error: "Failed to create a Meeting : ", err });
    }
}

const index = async (req, res) => {
    query = req.query;
    query.deleted = false;
    try {
        let result = await MeetingHistory.aggregate([
            { $match: query },
            {
                $project: {
                    agenda: 1,
                    location: 0,
                    dateTime: 0,
                    note: 0
                }
            },
        ]);
        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}

const view = async (req, res) => {
    let response = await MeetingHistory.findOne({ _id: req.params.id });
    if (!response) return res.status(404).json({ message: "no Data Found." });
    let result = await MeetingHistory.aggregate([
        { $match: { _id: response._Id, deleted: false } },
        {
            $project: {
                agenda: 1,
                location: 0,
                dateTime: 0,
                note: 0
            }
        }
    ]);
    res.status(200).json({ result: result[0], });
}

const deleteData = async (req, res) => {
    try {
        const result = await MeetingHistory.findByIdAndUpdate(req.params.id, {
            deleted: true,
        });
        res.status(200).json({ message: "done", result });
    } catch (err) {
        res.status(404).json({ message: "error", err });
    }
}

const deleteMany = async (req, res) => {
    try {
        const result = await MeetingHistory.updateMany(
            { _id: { $in: req.body } },
            { $set: { deleted: true } }
        );

        if (result?.matchedCount > 0 && result?.modifiedCount > 0) {
            return res
                .status(200)
                .json({ message: "Meetings Removed successfully", result });
        } else {
            return res
                .status(404)
                .json({ success: false, message: "Failed to remove Invoices" });
        }
    } catch (err) {
        return res.status(404).json({ success: false, message: "error", err });
    }
}

module.exports = { add, index, view, deleteData, deleteMany }