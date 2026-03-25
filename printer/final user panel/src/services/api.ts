import { Work, FileItem } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
    uploadFiles: async (files: File[]): Promise<FileItem[]> => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();

        // Map backend response to frontend FileItem
        return data.files.map((f: any) => ({
            id: f.filename, // Using filename as ID for now or generated one
            name: f.originalName,
            size: f.size,
            pageCount: f.pageCount, // Store this if we update types
            path: f.path
        }));
    },

    calculatePrice: async (works: Work[]) => {
        // Transform frontend Work to backend expected format if needed
        // Backend expects: { works: [ { pageSize, colorType ... files: [...] } ] }
        // Frontend Work has properties: { paperSize, color ... }

        const backendWorks = works.map(w => ({
            pageSize: w.properties.paperSize.toUpperCase(),
            colorType: w.properties.color ? 'COLOR' : 'BW',
            printSide: w.properties.sided.toUpperCase(), // SINGLE / DOUBLE
            copies: w.properties.copies,
            bindingType: w.properties.binding.toUpperCase(),
            files: w.files // We need to make sure files object matches what backend expects or backend can handle it
            // Backend expects files to have pageCount. frontend FileItem doesn't have it by default.
            // We need to update FileItem type to include pageCount.
        }));

        const response = await fetch(`${API_URL}/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ works: backendWorks }),
        });

        if (!response.ok) throw new Error('Calculation failed');
        return response.json();
    },

    getPricingRules: async () => {
        const response = await fetch(`${API_URL}/rules`);
        if (!response.ok) throw new Error('Failed to fetch pricing rules');
        return response.json();
    },

    createOrder: async (orderData: { shopId: string; mobile: string; works: Work[]; totalAmount: number }) => {
        // Transform works to backend format
        const backendWorks = orderData.works.map(w => ({
            pageSize: w.properties.paperSize.toUpperCase(),
            colorType: w.properties.color ? 'COLOR' : 'BW',
            printSide: w.properties.sided.toUpperCase(),
            copies: w.properties.copies,
            bindingType: w.properties.binding.toUpperCase(),
            calculatedPrice: w.price,
            files: w.files.map((f: any) => ({
                originalName: f.name,
                filePath: f.path || 'dummy_path', // We need path from upload response
                fileType: f.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
                pageCount: f.pageCount || 1,
                printablePages: f.pageCount || 1 // Backend will recalc/validate this
            }))
        }));

        const response = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shopId: orderData.shopId || 'default',
                mobile: orderData.mobile,
                totalAmount: orderData.totalAmount,
                works: backendWorks
            }),
        });

        if (!response.ok) throw new Error('Order creation failed');
        return response.json();
    },

    getShop: async (id: string = 'default') => {
        const response = await fetch(`${API_URL}/shop/${id}`);
        if (!response.ok) throw new Error('Failed to fetch shop');
        return response.json();
    }
};
