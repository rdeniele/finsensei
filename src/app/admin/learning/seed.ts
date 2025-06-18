import { learningContentService, type LearningContent } from '@/services/learningContentService';

const seedContent: Omit<LearningContent, 'id' | 'created_at' | 'updated_at' | 'created_by'>[] = [
  {
    title: "How to Build Wealth from Scratch",
    description: "Learn the fundamental principles of building wealth and achieving financial freedom. This comprehensive guide covers everything from saving strategies to investment basics.",
    url: "https://youtu.be/DwoDXfv_-G0",
    is_featured: true,
    status: "active" as const,
  },
  {
    title: "5 Essential Money Management Tips",
    description: "Discover five crucial money management tips that can help you take control of your finances. From budgeting to emergency funds, learn how to make your money work for you.",
    url: "https://finsensei.com/blog/money-management-tips",
    is_featured: true,
    status: "active" as const,
  },
  {
    title: "Investment Fundamentals Course",
    description: "A comprehensive course covering the basics of investing. Learn about stocks, bonds, mutual funds, and how to build a diversified portfolio that matches your goals.",
    url: "https://finsensei.com/courses/investment-fundamentals",
    is_featured: true,
    status: "active" as const,
  },
  {
    title: "Budgeting for Beginners",
    description: "A step-by-step guide to creating and maintaining a budget. Learn how to track your expenses, set financial goals, and make your money go further.",
    url: "https://finsensei.com/blog/budgeting-beginners",
    is_featured: false,
    status: "active" as const,
  },
  {
    title: "Understanding Credit Scores",
    description: "Learn everything you need to know about credit scores, how they're calculated, and how to improve yours. Essential knowledge for financial health.",
    url: "https://youtu.be/tZazCRkiZPE",
    is_featured: false,
    status: "active" as const,
  }
];

export async function seedLearningContent() {
  try {
    for (const content of seedContent) {
      await learningContentService.createContent({
        ...content,
        created_by: '00000000-0000-0000-0000-000000000000', // Replace with actual admin user ID
      });
    }
    console.log('Successfully seeded learning content');
  } catch (error) {
    console.error('Error seeding learning content:', error);
  }
} 