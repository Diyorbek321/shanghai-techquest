// The ten Shanghai School vocabulary tests (500 words, 50 per test), in order.
import { VOCAB_TEST_01 } from './test01';
import { VOCAB_TEST_02 } from './test02';
import { VOCAB_TEST_03 } from './test03';
import { VOCAB_TEST_04 } from './test04';
import { VOCAB_TEST_05 } from './test05';
import { VOCAB_TEST_06 } from './test06';
import { VOCAB_TEST_07 } from './test07';
import { VOCAB_TEST_08 } from './test08';
import { VOCAB_TEST_09 } from './test09';
import { VOCAB_TEST_10 } from './test10';
import type { RawPackQuestion } from '../englishSoNeitherUsedTo';

export const VOCAB_TESTS: readonly (readonly RawPackQuestion[])[] = [
  VOCAB_TEST_01,
  VOCAB_TEST_02,
  VOCAB_TEST_03,
  VOCAB_TEST_04,
  VOCAB_TEST_05,
  VOCAB_TEST_06,
  VOCAB_TEST_07,
  VOCAB_TEST_08,
  VOCAB_TEST_09,
  VOCAB_TEST_10,
];
