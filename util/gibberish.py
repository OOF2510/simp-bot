# from https://foliant-docs.github.io/docs/tutorials/preprocessor/generator/

from random import choice
from random import randint
from random import random


def pick_letter() -> str:
    """
    Pick a random letter.
    Vowels have a higher chance of picking.
    Letters q, w, x and z have the lowest chance of picking.
    """

    rare_letters = 'qwxz'
    vowels = 'aeiouy'
    consonants = 'cdfghjklmnprstv'

    pick = random()
    if pick > 0.9:
        return choice(rare_letters)
    elif pick > 0.3:
        return choice(vowels)
    else:
        return choice(consonants)

def gen_word() -> str:
    """Return a word consisting of 2 to 9 letters."""
    word_len = randint(2, 9)
    return ''.join(pick_letter() for _ in range(word_len))


def gen_sentence(num_words: int = 7) -> str:
    """Generate a sentence consisting of `num_words` words."""
    words = (gen_word() for _ in range(num_words))
    return ' '.join(words).capitalize()


def gen_text(num_sentences: int = 10) -> str:
    """
    Generate a paragraph of gibberish consisting of `num_sentences`
    senteces, each consisting of 3 to 12 words.
    """

    sizes = (randint(3, 12) for _ in range(num_sentences))
    sentences = (gen_sentence(size) for size in sizes)
    return '. '.join(sentences) + '.'

print(gen_text())