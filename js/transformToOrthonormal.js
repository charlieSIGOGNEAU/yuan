function transformToOrthonormal(x, y) {
  return [(x + 0.5 * y), (Math.sqrt(3) / 2) * -y];
}

// Export the function for use in other modules
export { transformToOrthonormal }; 