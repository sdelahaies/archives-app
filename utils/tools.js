export const handleNavigation = (direction) => {
    const currentIndex = lines.findIndex(line => line.id_line === currentLineIndex);
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < lines.length) {
        handlePolygonClick(lines[newIndex]);
    }
};