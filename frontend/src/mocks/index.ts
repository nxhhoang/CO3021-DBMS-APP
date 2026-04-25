export async function enableMocking() {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'true') {
    return true // Trả về true để Provider biết là không cần đợi mocking
  }

  if (typeof window === 'undefined') {
    return false
  }

  const { worker } = await import('./browser')
  // worker.start() trả về một Promise, chúng ta await nó để chắc chắn MSW đã sẵn sàng
  await worker.start({
    onUnhandledRequest: 'bypass', // Tránh log cảnh báo cho các tài sản tĩnh (fonts, images)
  })

  return true
}
