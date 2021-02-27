import { Request, Response } from 'express';
import cheerio from 'cheerio';
import got from 'got';

class RepositoryController {
    async index(request: Request, response: Response) {
        const url = `https://github.com/trending/${encodeURIComponent(request.query.language)}?since=${request.query.interval}`

        got(url).then(async html => {
            const $ = cheerio.load(html.body);

            let paths = []
            let stars = []

            $('.muted-link').each((i, link) => {
                const href = link.attribs.href;
                const stargazers = link.children[link.children.length - 1].data.split('\n')[1].trim()

                stars.push(stargazers)
                paths.push(href)
            });

            const uniquePaths = []

            paths.forEach((path, index) => {
                if (index % 2 === 0) {
                    const splitted = path.split('/')

                    uniquePaths.push(splitted[1] + '/' + splitted[2])

                }

            })

            stars = stars.filter((item, index) => index % 2 === 0)

            const res = uniquePaths.map((item, index) => {
                return {
                    repo: item,
                    stargazers: stars[index]
                }
            })

            response.send({ data: res })
        }).catch(err => {
            console.log(err);
        });
    }
}

export { RepositoryController }