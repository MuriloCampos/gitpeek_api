import { Request, Response } from 'express';
import cheerio from 'cheerio';
import got from 'got';
import axios from 'axios';
import { getRepository } from 'typeorm';

import { Repo } from '../models/Repo';

class RepositoryController {
    async featuredRepos(request: Request, response: Response) {
        const ormRepository = getRepository(Repo);
        const language = typeof request.query.language === 'string' ? request.query.language : '';
        const url = `https://github.com/trending/${encodeURIComponent(language)}?since=${request.query.interval}`;

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

            let reposToReturn = []

            for(let i = 0; i < uniquePaths.length; i++) {
                const [owner, name] = uniquePaths[i].split('/');

                const newRepo = ormRepository.create({
                    name,
                    owner,
                    stars: stars[i],
                    html_url: `https://github.com/${uniquePaths[i]}`
                })

                await ormRepository.save(newRepo);

                reposToReturn.push({
                    repo: uniquePaths[i],
                    stargazers: stars[i]
                }) 
            }

            response.send({ data: reposToReturn })
        }).catch(err => {
            console.log(err);
        });
    }

    async starredRepos(request: Request, response: Response) {
        const ormRepository = getRepository(Repo);
        const language = typeof request.query.language === 'string' ? request.query.language : ''
        const url = `https://api.github.com/search/repositories?q=language:${encodeURIComponent(language)}&sort=stars&order=desc`
        const api = axios.create()

        if (process.env.GITHUB_TOKEN) {
            api.defaults.headers.Authorization = process.env.GITHUB_TOKEN;
        }

        const res = await api.get(url)

        if (res && res.data && res.data.items.length > 0) {
            for(let i = 0; i < res.data.items.length; i++) {
                const newRepo = ormRepository.create({
                    name: res.data.items[i].name,
                    owner: res.data.items[i].owner.login,
                    stars: res.data.items[i].stargazers_count,
                    html_url: res.data.items[i].html_url
                })

                await ormRepository.save(newRepo);
            }
        }

        response.send(res.data.items)
    }
}

export { RepositoryController }