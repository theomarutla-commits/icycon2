// MOCK API FUNCTIONS
// In a real app, these would make network requests to your Django backend.
export const api = {
  login: async (email: string, pass: string) => {
    console.log('Attempting login with:', email, pass);
    if (!email || !pass) {
        await new Promise(resolve => setTimeout(resolve, 500));
        throw new Error('Please enter email and password.');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { user: { email }, token: 'fake-jwt-token' };
  },
  signup: async (email: string, pass: string) => {
    console.log('Attempting signup with:', email, pass);
    if (!email || !pass) {
        await new Promise(resolve => setTimeout(resolve, 500));
        throw new Error('Please enter email and password.');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { user: { email }, token: 'fake-jwt-token' };
  }
};