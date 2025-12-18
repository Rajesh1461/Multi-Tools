// Global error handler for uncaught JavaScript errors
window.addEventListener('error', function(event) {
  console.error('JavaScript Error:', {
    message: event.message,
    source: event.filename,
    line: event.lineno,
    column: event.colno,
    error: event.error
  });
  
  // You can also send this to an error tracking service
  // sendToAnalytics({
  //   type: 'javascript_error',
  //   message: event.message,
  //   file: event.filename,
  //   line: event.lineno,
  //   column: event.colno,
  //   stack: event.error?.stack
  // });
  
  // Prevent default error handling
  return true;
}, true);

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
  
  // You can also send this to an error tracking service
  // sendToAnalytics({
  //   type: 'unhandled_rejection',
  //   reason: event.reason?.message || String(event.reason),
  //   stack: event.reason?.stack
  // });
  
  // Prevent default error handling
  event.preventDefault();
});

// Function to safely initialize features
function safeInit(initFunction) {
  try {
    initFunction();
  } catch (error) {
    console.error('Initialization error:', error);
    // sendToAnalytics({
    //   type: 'initialization_error',
    //   message: error.message,
    //   stack: error.stack
    // });
  }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { safeInit };
}
