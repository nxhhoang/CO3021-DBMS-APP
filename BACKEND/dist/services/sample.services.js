"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SampleService {
    async getSamples() {
        return [
            { id: '1', name: 'Sample 1', description: 'This is sample 1', created_at: new Date() },
            { id: '2', name: 'Sample 2', description: 'This is sample 2', created_at: new Date() }
        ];
    }
    async createSample(payload) {
        const newSample = {
            id: Math.random().toString(36).substring(2, 9),
            ...payload,
            created_at: new Date()
        };
        return newSample;
    }
}
const sampleService = new SampleService();
exports.default = sampleService;
