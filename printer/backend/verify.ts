import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:3001/api';

async function testBackend() {
    console.log('Testing Backend...');

    // 1. Test Shop Endpoint
    try {
        const shopRes = await fetch(`${API_URL}/shop/default`);
        const shop = await shopRes.json();
        console.log('✅ Shop API:', shop.name ? 'Success' : 'Failed', shop);
    } catch (e) {
        console.error('❌ Shop API Failed', e);
    }

    // 2. Test File Upload (Create dummy file first)
    const dummyFilePath = path.join(__dirname, 'test.pdf');
    fs.writeFileSync(dummyFilePath, 'dummy pdf content'); // Not a real PDF, backend might fail analysis but should upload

    const formData = new FormData();
    const blob = new Blob([fs.readFileSync(dummyFilePath)], { type: 'application/pdf' });
    formData.append('files', blob, 'test.pdf');

    let uploadedFiles: any[] = [];
    try {
        const uploadRes = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const uploadData = await uploadRes.json();
        uploadedFiles = uploadData.files;
        console.log('✅ Upload API:', uploadedFiles.length > 0 ? 'Success' : 'Failed', uploadedFiles);
    } catch (e) {
        console.error('❌ Upload API Failed', e);
    }

    // 3. Test Pricing Calculation
    if (uploadedFiles.length > 0) {
        try {
            const works = [{
                pageSize: 'A4',
                colorType: 'BW',
                printSide: 'SINGLE',
                copies: 1,
                files: uploadedFiles
            }];

            const priceRes = await fetch(`${API_URL}/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ works })
            });
            const priceData = await priceRes.json();
            console.log('✅ Pricing API:', priceData.totalAmount !== undefined ? 'Success' : 'Failed', `Total: ${priceData.totalAmount}`);

            // 4. Create Order
            const orderRes = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shopId: 'default', // Using default logic in controller or seed ID
                    mobile: '1234567890',
                    totalAmount: priceData.totalAmount,
                    works: works
                })
            });
            const orderData = await orderRes.json();
            console.log('✅ Create Order API:', orderData.id ? 'Success' : 'Failed', `Order ID: ${orderData.id}`);

        } catch (e) {
            console.error('❌ order/pricing flow Failed', e);
        }
    }

    // Cleanup
    if (fs.existsSync(dummyFilePath)) fs.unlinkSync(dummyFilePath);
}

testBackend();
