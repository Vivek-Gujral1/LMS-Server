// src/models/course.ts

export enum MainCategory {
    ACADEMIC_SUBJECTS = 'ACADEMIC_SUBJECTS',
    PROFESSIONAL_DEVELOPMENT = 'PROFESSIONAL_DEVELOPMENT',
    TECHNOLOGY_AND_COMPUTER_SCIENCE = 'TECHNOLOGY_AND_COMPUTER_SCIENCE',
    HEALTH_AND_WELLNESS = 'HEALTH_AND_WELLNESS',
    CREATIVE_ARTS = 'CREATIVE_ARTS',
    ENGINEERING_AND_TECHNOLOGY = 'ENGINEERING_AND_TECHNOLOGY',
    PERSONAL_DEVELOPMENT = 'PERSONAL_DEVELOPMENT',
    SPECIALIZED_COURSES = 'SPECIALIZED_COURSES',
    INTERDISCIPLINARY_STUDIES = 'INTERDISCIPLINARY_STUDIES',
    MISCELLANEOUS = 'MISCELLANEOUS',
  }
  
  export enum SubCategory {
    // Academic Subjects
    MATHEMATICS = 'MATHEMATICS',
    SCIENCE = 'SCIENCE',
    PHYSICS = 'PHYSICS',
    CHEMISTRY = 'CHEMISTRY',
    BIOLOGY = 'BIOLOGY',
    HISTORY = 'HISTORY',
    LITERATURE = 'LITERATURE',
    LANGUAGES = 'LANGUAGES',
    ENGLISH = 'ENGLISH',
    SPANISH = 'SPANISH',
    FRENCH = 'FRENCH',
    GEOGRAPHY = 'GEOGRAPHY',
    ECONOMICS = 'ECONOMICS',
    POLITICAL_SCIENCE = 'POLITICAL_SCIENCE',
    PSYCHOLOGY = 'PSYCHOLOGY',
    SOCIOLOGY = 'SOCIOLOGY',
    PHILOSOPHY = 'PHILOSOPHY',
  
    // Professional Development
    BUSINESS_ADMINISTRATION = 'BUSINESS_ADMINISTRATION',
    MARKETING = 'MARKETING',
    FINANCE = 'FINANCE',
    MANAGEMENT = 'MANAGEMENT',
    LEADERSHIP = 'LEADERSHIP',
    PROJECT_MANAGEMENT = 'PROJECT_MANAGEMENT',
    ENTREPRENEURSHIP = 'ENTREPRENEURSHIP',
    HUMAN_RESOURCES = 'HUMAN_RESOURCES',
  
    // Technology and Computer Science
    PROGRAMMING = 'PROGRAMMING',
    JAVASCRIPT = 'JAVASCRIPT',
    PYTHON = 'PYTHON',
    JAVA = 'JAVA',
    WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
    MOBILE_APP_DEVELOPMENT = 'MOBILE_APP_DEVELOPMENT',
    DATA_SCIENCE = 'DATA_SCIENCE',
    MACHINE_LEARNING_AI = 'MACHINE_LEARNING_AI',
    CYBERSECURITY = 'CYBERSECURITY',
    CLOUD_COMPUTING = 'CLOUD_COMPUTING',
    SOFTWARE_ENGINEERING = 'SOFTWARE_ENGINEERING',
    DATABASE_MANAGEMENT = 'DATABASE_MANAGEMENT',
  
    // Health and Wellness
    NUTRITION = 'NUTRITION',
    FITNESS = 'FITNESS',
    YOGA = 'YOGA',
    MEDITATION = 'MEDITATION',
    MENTAL_HEALTH = 'MENTAL_HEALTH',
    NURSING = 'NURSING',
    HEALTHCARE_MANAGEMENT = 'HEALTHCARE_MANAGEMENT',
  
    // Creative Arts
    MUSIC = 'MUSIC',
    VISUAL_ARTS = 'VISUAL_ARTS',
    DRAWING = 'DRAWING',
    PAINTING = 'PAINTING',
    SCULPTURE = 'SCULPTURE',
    PHOTOGRAPHY = 'PHOTOGRAPHY',
    FILM_VIDEO_PRODUCTION = 'FILM_VIDEO_PRODUCTION',
    GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
    WRITING_COMPOSITION = 'WRITING_COMPOSITION',
  
    // Engineering and Technology
    ELECTRICAL_ENGINEERING = 'ELECTRICAL_ENGINEERING',
    MECHANICAL_ENGINEERING = 'MECHANICAL_ENGINEERING',
    CIVIL_ENGINEERING = 'CIVIL_ENGINEERING',
    AEROSPACE_ENGINEERING = 'AEROSPACE_ENGINEERING',
    ENVIRONMENTAL_ENGINEERING = 'ENVIRONMENTAL_ENGINEERING',
    ROBOTICS = 'ROBOTICS',
  
    // Personal Development
    TIME_MANAGEMENT = 'TIME_MANAGEMENT',
    COMMUNICATION_SKILLS = 'COMMUNICATION_SKILLS',
    PERSONAL_FINANCE = 'PERSONAL_FINANCE',
    CAREER_PLANNING_DEVELOPMENT = 'CAREER_PLANNING_DEVELOPMENT',
    GOAL_SETTING = 'GOAL_SETTING',
    STRESS_MANAGEMENT = 'STRESS_MANAGEMENT',
  
    // Specialized Courses
    LEGAL_STUDIES = 'LEGAL_STUDIES',
    EDUCATION_TEACHING_METHODS = 'EDUCATION_TEACHING_METHODS',
    ARCHITECTURE = 'ARCHITECTURE',
    LINGUISTICS = 'LINGUISTICS',
    RELIGIOUS_STUDIES = 'RELIGIOUS_STUDIES',
    ARCHAEOLOGY = 'ARCHAEOLOGY',
  
    // Interdisciplinary Studies
    INTERDISCIPLINARY_STUDIES = 'INTERDISCIPLINARY_STUDIES',
    LIBERAL_ARTS = 'LIBERAL_ARTS',
    GLOBAL_STUDIES = 'GLOBAL_STUDIES',
    CULTURAL_STUDIES = 'CULTURAL_STUDIES',
    ENVIRONMENTAL_STUDIES = 'ENVIRONMENTAL_STUDIES',
  
    // Miscellaneous
    GAMING_GAME_DEVELOPMENT = 'GAMING_GAME_DEVELOPMENT',
    SPORTS_MANAGEMENT = 'SPORTS_MANAGEMENT',
    HOSPITALITY_TOURISM = 'HOSPITALITY_TOURISM',
    FASHION_DESIGN = 'FASHION_DESIGN',
    DISASTER_MANAGEMENT = 'DISASTER_MANAGEMENT',
  }
  
  export interface CategoryMapping {
    [key: string]: SubCategory[];
  }
  
  export const categoryMapping: CategoryMapping = {
    [MainCategory.ACADEMIC_SUBJECTS]: [
      SubCategory.MATHEMATICS,
      SubCategory.SCIENCE,
      SubCategory.PHYSICS,
      SubCategory.CHEMISTRY,
      SubCategory.BIOLOGY,
      SubCategory.HISTORY,
      SubCategory.LITERATURE,
      SubCategory.LANGUAGES,
      SubCategory.ENGLISH,
      SubCategory.SPANISH,
      SubCategory.FRENCH,
      SubCategory.GEOGRAPHY,
      SubCategory.ECONOMICS,
      SubCategory.POLITICAL_SCIENCE,
      SubCategory.PSYCHOLOGY,
      SubCategory.SOCIOLOGY,
      SubCategory.PHILOSOPHY,
    ],
    [MainCategory.PROFESSIONAL_DEVELOPMENT]: [
      SubCategory.BUSINESS_ADMINISTRATION,
      SubCategory.MARKETING,
      SubCategory.FINANCE,
      SubCategory.MANAGEMENT,
      SubCategory.LEADERSHIP,
      SubCategory.PROJECT_MANAGEMENT,
      SubCategory.ENTREPRENEURSHIP,
      SubCategory.HUMAN_RESOURCES,
    ],
    [MainCategory.TECHNOLOGY_AND_COMPUTER_SCIENCE]: [
      SubCategory.PROGRAMMING,
      SubCategory.JAVASCRIPT,
      SubCategory.PYTHON,
      SubCategory.JAVA,
      SubCategory.WEB_DEVELOPMENT,
      SubCategory.MOBILE_APP_DEVELOPMENT,
      SubCategory.DATA_SCIENCE,
      SubCategory.MACHINE_LEARNING_AI,
      SubCategory.CYBERSECURITY,
      SubCategory.CLOUD_COMPUTING,
      SubCategory.SOFTWARE_ENGINEERING,
      SubCategory.DATABASE_MANAGEMENT,
    ],
    [MainCategory.HEALTH_AND_WELLNESS]: [
      SubCategory.NUTRITION,
      SubCategory.FITNESS,
      SubCategory.YOGA,
      SubCategory.MEDITATION,
      SubCategory.MENTAL_HEALTH,
      SubCategory.NURSING,
      SubCategory.HEALTHCARE_MANAGEMENT,
    ],
    [MainCategory.CREATIVE_ARTS]: [
      SubCategory.MUSIC,
      SubCategory.VISUAL_ARTS,
      SubCategory.DRAWING,
      SubCategory.PAINTING,
      SubCategory.SCULPTURE,
      SubCategory.PHOTOGRAPHY,
      SubCategory.FILM_VIDEO_PRODUCTION,
      SubCategory.GRAPHIC_DESIGN,
      SubCategory.WRITING_COMPOSITION,
    ],
    [MainCategory.ENGINEERING_AND_TECHNOLOGY]: [
      SubCategory.ELECTRICAL_ENGINEERING,
      SubCategory.MECHANICAL_ENGINEERING,
      SubCategory.CIVIL_ENGINEERING,
      SubCategory.AEROSPACE_ENGINEERING,
      SubCategory.ENVIRONMENTAL_ENGINEERING,
      SubCategory.ROBOTICS,
    ],
    [MainCategory.PERSONAL_DEVELOPMENT]: [
      SubCategory.TIME_MANAGEMENT,
      SubCategory.COMMUNICATION_SKILLS,
      SubCategory.PERSONAL_FINANCE,
      SubCategory.CAREER_PLANNING_DEVELOPMENT,
      SubCategory.GOAL_SETTING,
      SubCategory.STRESS_MANAGEMENT,
    ],
    [MainCategory.SPECIALIZED_COURSES]: [
      SubCategory.LEGAL_STUDIES,
      SubCategory.EDUCATION_TEACHING_METHODS,
      SubCategory.ARCHITECTURE,
      SubCategory.LINGUISTICS,
      SubCategory.RELIGIOUS_STUDIES,
      SubCategory.ARCHAEOLOGY,
    ],
    [MainCategory.INTERDISCIPLINARY_STUDIES]: [
      SubCategory.INTERDISCIPLINARY_STUDIES,
      SubCategory.LIBERAL_ARTS,
      SubCategory.GLOBAL_STUDIES,
      SubCategory.CULTURAL_STUDIES,
      SubCategory.ENVIRONMENTAL_STUDIES,
    ],
    [MainCategory.MISCELLANEOUS]: [
      SubCategory.GAMING_GAME_DEVELOPMENT,
      SubCategory.SPORTS_MANAGEMENT,
      SubCategory.HOSPITALITY_TOURISM,
      SubCategory.FASHION_DESIGN,
      SubCategory.DISASTER_MANAGEMENT,
    ],
  };
  