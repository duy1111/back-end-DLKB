import handbookService from '../services/handbookService';
let createHandbook = async (req, res) => {
    try {
        let data = await handbookService.createHandbook(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

let getAllHandbook = async (req, res) => {
    try {
        let data = await handbookService.getAllHandbook();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

let getDetailHandbookById = async (req, res) => {
    try {
        let data = await handbookService.getDetailHandbookById(req.query.id);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

let handleUpdateHandbook = async (req, res) => {
    try {
        console.log('check update data', req.body);
        let data = await handbookService.handleUpdateHandbook(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};

let handleDeleteHandbook = async (req, res) => {
    try {
        console.log('check handbook id', req.body.id);
        let data = await handbookService.handleDeleteHandbook(req.body.id);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};
let handbookNotApprovedYet = async (req, res) => {
    try {
        let data = await handbookService.handbookNotApprovedYet();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};
let handbookApprovedYet = async (req, res) => {
    try {
        let data = await handbookService.handbookApprovedYet(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
};
let DoneHandbook = async (req,res) => {
    try{
        let data = await handbookService.DoneHandbook();
        return res.status(200).json(data);
    }
    catch(e){
        return res.status(400).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}
module.exports = {
    createHandbook: createHandbook,
    getAllHandbook: getAllHandbook,
    getDetailHandbookById: getDetailHandbookById,
    handleUpdateHandbook: handleUpdateHandbook,
    handleDeleteHandbook: handleDeleteHandbook,
    handbookNotApprovedYet: handbookNotApprovedYet,
    handbookApprovedYet: handbookApprovedYet,
    DoneHandbook:DoneHandbook,
};
