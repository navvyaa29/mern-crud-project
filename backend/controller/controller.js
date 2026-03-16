const Company = require("../model/company.model");
const Department = require("../model/department.model");
const Employee = require("../model/employee.model");
const Project = require("../model/project.model");
const Task = require("../model/task.model");
const Role = require("../model/role.model");
const Address = require("../model/address.model");
const dbService=require("../services/db.service");

const read = async(req, res,schema) => {
  try{
    const dbRes= await dbService.readRecord(schema);
    res.status(200).json(dbRes);
     }catch(err){
        res.status(424).json({
            message : 'Unable to get data!',
            error: err
        })

    }
}

const create = async(req, res,schema) => {
  try{
    const data = req.body;
    const dbRes= await dbService.createRecord(data,schema);
    res.status(200).json({
        message : 'Record created',
        data : dbRes
    });
     }catch(err){
        res.status(424).json({
            message : 'Unable to create data!',
            error: err
        })

    }
}

const update = async(req, res,schema) => {
 try{
    const id=req.params.id;
    const data = req.body;
    const dbRes= await dbService.updateRecord(id,data,schema);
    res.status(200).json({
        message : 'Record updated',
        data : dbRes
    });
     }catch(err){
        res.status(424).json({
            message : 'Unable to update data!',
            error: err
        })

    }
};

const remove = async(req, res,schema) => {
 try{
    const id=req.params.id;
    const dbRes= await dbService.removeRecord(id,schema);
    res.status(200).json({
        message : 'Record removed',
        data : dbRes
    });
     }catch(err){
        res.status(424).json({
            message : 'Unable to remove data!',
            error: err
        })

    }
};

const createCompany = async (req,res) => {
  try{
    const company = new Company(req.body);
    const data = await company.save();

    res.status(200).json({
      message:"Company created",
      data:data
    });

  }catch(err){
    res.status(400).json({
      message:"Unable to create company",
      error:err
    });
  }
}

const createDepartment = async (req,res) => {
  try{
    const department = new Department(req.body);
    const data = await department.save();

    res.status(200).json({
      message:"Department created",
      data:data
    });

  }catch(err){
    res.status(400).json({
      message:"Unable to create department",
      error:err
    });
  }
}

const createProject = async (req,res) => {
  try{
    const project = new Project(req.body);
    const data = await project.save();

    res.status(200).json({
      message:"Project created",
      data:data
    });

  }catch(err){
    res.status(400).json({
      message:"Unable to create project",
      error:err
    });
  }
}


const getDepartments = async(req,res) => {
  try{

    const data = await Department
      .find()
      .populate("company");

    res.status(200).json(data);

  }catch(err){
    res.status(400).json({
      message:"Unable to fetch departments",
      error:err
    });
  }
}

const getCompanies = async(req,res)=>{
  try{
    const data = await Company.find();
    res.status(200).json(data);
  }catch(err){
    res.status(400).json({
      message:"Unable to fetch companies"
    });
  }
}

const getProjects = async(req,res)=>{
  try{
    const data = await Project.find().populate("company");
    res.status(200).json(data);
  }catch(err){
    res.status(400).json({
      message:"Unable to fetch projects"
    });
  }
}

module.exports = {
  read,
  create,
  update,
  remove,
  createCompany,
  createDepartment,
  createProject,
  getDepartments,
  getCompanies,
  getProjects
};