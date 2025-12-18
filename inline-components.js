const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Configuration
const HTML_DIR = __dirname;
const COMPONENTS_DIR = path.join(__dirname, 'components');

// Get all HTML files
async function getHtmlFiles(dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const htmlFiles = [];

    for (const dirent of dirents) {
        const res = path.resolve(dir, dirent.name);

        if (dirent.isDirectory() && !res.includes('node_modules') && !res.includes('.git') && !res.includes('components')) {
            htmlFiles.push(...(await getHtmlFiles(res)));
        } else if (dirent.name.endsWith('.html')) {
            htmlFiles.push(res);
        }
    }

    return htmlFiles;
}

// Read component content
async function getComponent(name) {
    try {
        const content = await readFile(path.join(COMPONENTS_DIR, name), 'utf8');
        return content;
    } catch (error) {
        console.error(`Error reading component ${name}:`, error.message);
        return null;
    }
}

// Inline components into HTML
// Inline components into HTML
async function inlineComponents(filePath, components) {
    try {
        let content = await readFile(filePath, 'utf8');
        let updated = false;

        // Inline Header
        if (components.header && content.includes('<div id="header"></div>')) {
            // Adjust relative paths in header based on file depth
            let headerContent = components.header;
            const depth = path.relative(HTML_DIR, filePath).split(path.sep).length - 1;

            if (depth === 0) {
                // Root file (index.html) - remove ../ from links
                headerContent = headerContent.replace(/\.\.\//g, '');
            } else {
                // Subdirectory file - keep ../ or adjust if deeper
                // Current header.html uses ../ assuming it's in tools/
            }

            content = content.replace('<div id="header"></div>', `<div id="header">${headerContent}</div>`);
            updated = true;
        }

        // Inline Footer (Handle both single and double quotes)
        const footerRegex = /<div id=["']footer["']><\/div>/;
        if (components.footer && footerRegex.test(content)) {
            content = content.replace(footerRegex, `<div id="footer">${components.footer}</div>`);
            updated = true;
        }

        // Inline Breadcrumb (only for tools)
        if (components.breadcrumb && content.includes('<div id="breadcrumb"></div>')) {
            content = content.replace('<div id="breadcrumb"></div>', `<div id="breadcrumb">${components.breadcrumb}</div>`);
            updated = true;
        }

        // Remove inline fetch scripts if present (SAFER REGEX)
        // We use (?:(?!<\/script>)[\s\S])*? to ensure we don't match across script tags

        // Header fetch removal
        const headerFetchRegex = /<script>(?:(?!<\/script>)[\s\S])*?fetch\(['"]\.\.\/components\/header\.html['"]\)(?:(?!<\/script>)[\s\S])*?<\/script>/g;
        if (headerFetchRegex.test(content)) {
            content = content.replace(headerFetchRegex, '');
            updated = true;
        }

        // Footer fetch removal
        const footerFetchRegex = /<script>(?:(?!<\/script>)[\s\S])*?fetch\(['"]\.\.\/components\/footer\.html['"]\)(?:(?!<\/script>)[\s\S])*?<\/script>/g;
        if (footerFetchRegex.test(content)) {
            content = content.replace(footerFetchRegex, '');
            updated = true;
        }

        // Breadcrumb fetch removal
        const breadcrumbFetchRegex = /<script>(?:(?!<\/script>)[\s\S])*?fetch\(['"]\.\.\/components\/breadcrumb\.html['"]\)(?:(?!<\/script>)[\s\S])*?<\/script>/g;
        if (breadcrumbFetchRegex.test(content)) {
            content = content.replace(breadcrumbFetchRegex, '');
            updated = true;
        }

        if (updated) {
            await writeFile(filePath, content, 'utf8');
            console.log(`Inlined components in: ${path.relative(process.cwd(), filePath)}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// Main function
async function main() {
    try {
        const htmlFiles = await getHtmlFiles(HTML_DIR);

        const components = {
            header: await getComponent('header.html'),
            footer: await getComponent('footer.html'),
            breadcrumb: await getComponent('breadcrumb.html')
        };

        if (!components.header || !components.footer) {
            console.error('Failed to load critical components');
            return;
        }

        console.log(`Found ${htmlFiles.length} HTML files to process`);

        for (const file of htmlFiles) {
            await inlineComponents(file, components);
        }

        console.log('\nInlining complete!');
    } catch (error) {
        console.error('Error during inlining:', error);
        process.exit(1);
    }
}

main();
