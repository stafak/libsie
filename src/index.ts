import { CP437ToString } from "./cp437";
import {parse} from './parser';

export const readBuffer = (buffer: Uint8Array) => parse(CP437ToString(buffer));