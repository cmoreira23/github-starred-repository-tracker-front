import { Owner } from './owner';

export interface GithubRepository {
    id: number;
    name: string;
    forks_count: number;
    language: string;
    stargazers_count: number;
    url: string;
    owner:Owner;
}