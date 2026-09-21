import npc1 from '../assets/mundo/npc1.png';
import npc2 from '../assets/mundo/npc2.png';
import npc3 from '../assets/mundo/npc3.png';
import npc4 from '../assets/mundo/npc4.png';
import npc5 from '../assets/mundo/npc5.png';

import dialogueNpc1 from '../assets/mundo/npc1.png';
import dialogueNpc2 from '../assets/mundo/npc2.png';
import dialogueNpc3 from '../assets/mundo/npc3.png';
import dialogueNpc4 from '../assets/mundo/npc4.png';
import dialogueNpc5 from '../assets/mundo/npc5.png';

const NPC1 = npc1;
const NPC2 = npc2;
const NPC3 = npc3;
const NPC4 = npc4;
const NPC5 = npc5;


export interface NPCDialogue {
    text: string;
    image: string;
}

export interface NPCData {
    id: string;
    name: string;
    spriteUrl: string;
    x: number;
    y: number;
    dialogues: NPCDialogue[];
}

export const NPC_LIST: NPCData[] = [
    {
        id: 'npc1',
        name: 'Victor',
        spriteUrl: NPC1,
        x: 465,
        y: 585,
        dialogues: [
            {
                text: 'Tip of the day: change your phone to the language you are learning. Your brain will do mental push-ups without you noticing.',
                image: dialogueNpc1
            },
            {
                text: 'Practice verbs by making short sentences about your day. It is like warming up before a game.',
                image: dialogueNpc1
            },
            {
                text: 'Listen to five minutes of audio in the language every morning. It is coffee for your brain.',
                image: dialogueNpc1
            }
        ]
    },
    {
        id: 'npc2',
        name: 'Pedro',
        spriteUrl: NPC2,
        x: 810,
        y: 350,
        dialogues: [
            {
                text: 'Play mini-games to review vocabulary. Your mind learns more when it is having fun.',
                image: dialogueNpc2
            },
            {
                text: 'Say out loud what you learn. Even if it sounds strange, it helps a lot.',
                image: dialogueNpc2
            }
        ]
    },
    {
        id: 'npc3',
        name: 'Hector',
        spriteUrl: NPC3,
        x: 730,
        y: 930,
        dialogues: [
            {
                text: 'Repeat short phrases several times a day. Repetition is your superpower.',
                image: dialogueNpc3
            },
            {
                text: 'When you do not understand something, do not stop! Guessing from context is also learning.',
                image: dialogueNpc3
            },
            {
                text: 'Spend 10 minutes a day practicing. You do not need more to become impressively good.',
                image: dialogueNpc3
            }
        ]
    },
    {
        id: 'npc4',
        name: 'Luis',
        spriteUrl: NPC4,
        x: 600,
        y: 400,
        dialogues: [
            {
                text: 'Read aloud every day. Your pronunciation will improve before you even notice.',
                image: dialogueNpc4
            },
            {
                text: 'Do not be afraid to make mistakes. Every mistake is a lesson in disguise.',
                image: dialogueNpc4
            },
            {
                text: 'Keep a diary in the language you are learning. Document your progress and thoughts.',
                image: dialogueNpc4
            }
        ]
    },
    {
        id: 'npc5',
        name: 'Carlos',
        spriteUrl: NPC5,
        x: 900,
        y: 650,
        dialogues: [
            {
                text: 'Use flashcards for new vocabulary. Spaced repetition is key.',
                image: dialogueNpc5
            },
            {
                text: 'Try to think in the language you are studying. Change the language of your inner thoughts.',
                image: dialogueNpc5
            },
            {
                text: 'Celebrate your small achievements. Every new word is a victory worth recognizing.',
                image: dialogueNpc5
            }
        ]
    }
];
