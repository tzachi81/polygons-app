import { Request, Response } from 'express';
import { closeDBConnection, connectDB } from '../model/db';
import { ObjectId } from 'mongodb';


export const getPolygons = async (_: Request, response: Response) => {
  try {
    const collection = await connectDB();
    const polygons = await collection.find({}).toArray();
    response.status(200).json(polygons.map(({ _id, ...rest }) => ({ id: _id, ...rest })));
  } catch (error) {
    response.status(500).json({ message: 'Error fetching polygons' });
  } finally {
    await closeDBConnection();
  }
};

export const createPolygon = async (request: Request, response: Response) => {
  try {
    const { name, points } = request.body;
    if (!name || !points) {
      return response.status(400).json({ message: 'Missing name or points' });
    }
    const collection = await connectDB();
    const result = await collection.insertOne({ name, points });
    response.status(201).json({ id: result.insertedId, name, points });
  } catch (error) {
    response.status(500).json({ message: 'Error creating polygon' });
  } finally {
    await closeDBConnection();
  }
};

export const deletePolygon = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const collection = await connectDB();
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return response.status(404).json({ message: 'Polygon not found' });
    }
    response.status(204).send();
  } catch (error) {
    response.status(500).json({ message: 'Error deleting polygon' });
  } finally {
    await closeDBConnection();
  }
};