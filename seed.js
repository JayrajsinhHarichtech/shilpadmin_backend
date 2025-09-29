import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Project from './src/models/Project.js';
import Testimonial from './src/models/Testimonial.js';
import Tool from './src/models/Tool.js';

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';

const projects = [
  { title: 'Website Redesign', description: 'Redesign for a corporate client', category: 'web', imageUrl: '/uploads/sample1.png', status: 'done' },
  { title: 'Mobile App', description: 'Cross-platform app', category: 'mobile', imageUrl: '/uploads/sample2.png', status: 'progress' }
];

const testimonials = [
  { name: 'Aisha', role: 'Client', message: 'Great work!', avatarUrl: '/uploads/default.png' },
  { name: 'Rohit', role: 'Client', message: 'Delivered on time.', avatarUrl: '/uploads/default.png' }
];

const tools = [
  { key: 'project', title: 'Project', description: 'Project management', enabled: true },
  { key: 'testimonials', title: 'Testimonials', description: 'Client testimonials', enabled: true },
  { key: 'project-tree', title: 'Project Tree', description: 'Tree view', enabled: true },
  { key: 'gemini', title: 'Gemini', description: 'AI Tools', enabled: true }
];

mongoose.connect(MONGO).then(async ()=>{
  console.log('Connected for seed');
  await Project.deleteMany({});
  await Testimonial.deleteMany({});
  await Tool.deleteMany({});
  await Project.insertMany(projects);
  await Testimonial.insertMany(testimonials);
  await Tool.insertMany(tools);
  console.log('Seed done');
  process.exit(0);
}).catch(err=>{ console.error(err); process.exit(1); });
