// Integration test to verify frontend-to-backend connectivity
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:8000';

async function testIntegration() {
    console.log('🔍 Starting Integration Test...\n');

    // Test 1: Health Check
    try {
        console.log('1. Testing health endpoint...');
        const health = await axios.get(`${API_URL}/health`);
        console.log('   ✅ Health check passed:', health.data);
    } catch (error) {
        console.error('   ❌ Health check failed:', error.message);
        return;
    }

    // Test 2: Test endpoint
    try {
        console.log('\n2. Testing /test endpoint...');
        const test = await axios.get(`${API_URL}/test`);
        console.log('   ✅ Test endpoint passed:', test.data);
    } catch (error) {
        console.error('   ❌ Test failed:', error.message);
    }

    // Test 3: Create a simple test image (1x1 red pixel PNG)
    console.log('\n3. Creating test image...');
    const testImagePath = path.join(__dirname, 'test_image.png');
    
    // Minimal PNG (1x1 red pixel) in base64
    const pngData = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        'base64'
    );
    fs.writeFileSync(testImagePath, pngData);
    console.log('   ✅ Test image created');

    // Test 4: Analyze the image
    try {
        console.log('\n4. Uploading and analyzing image...');
        const form = new FormData();
        form.append('file', fs.createReadStream(testImagePath));

        const response = await axios.post(`${API_URL}/analyze`, form, {
            headers: form.getHeaders(),
            timeout: 60000 // 60 second timeout
        });

        console.log('\n✅ ANALYSIS SUCCESSFUL!');
        console.log('───────────────────────────────────');
        console.log('Trust Score:', response.data.trust_score);
        console.log('Verdict:', response.data.verdict);
        console.log('Deepfake Probability:', response.data.deepfake_probability);
        console.log('Findings:', JSON.stringify(response.data.details?.findings || [], null, 2));
        console.log('───────────────────────────────────\n');

    } catch (error) {
        console.error('\n❌ ANALYSIS FAILED');
        console.error('Error:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('Full response:', JSON.stringify(error.response.data, null, 2));
        }
    } finally {
        // Cleanup
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
            console.log('✅ Test image cleaned up');
        }
    }

    console.log('\n🏁 Integration test complete!');
}

testIntegration().catch(console.error);
