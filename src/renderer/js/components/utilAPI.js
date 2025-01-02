export function ModifySvgColor(url, color, callback) {
    window.utilAPI.modifySvgColor(url, color)
        .then(svg => {
            if (typeof callback === 'function') {
                callback(true, svg);
            }
        })
        .catch(error => {
            console.error('Error getCompanies:', error);
            if (typeof callback === 'function') {
                callback(false, error);
            }
        });
}

export const GetPath = (path) => { 
    const pathnew =  window.utilAPI.getPath(path).then(newPath => newPath);
    console.log('getpath: '+pathnew);
    return pathnew;
}
