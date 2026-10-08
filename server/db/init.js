const fs = require('fs');
const path = require('path');

const dbFilePath = process.env.DATA_FILE || path.join(__dirname, 'prepsync_data.json');

// Memory state persisted to JSON
let data = {
  users: [],
  topics: [],
  user_progress: [],
  mock_interviews: [],
  resume_analyses: [],
  daily_goals: [],
  autoIds: {
    users: 1,
    topics: 1,
    user_progress: 1,
    mock_interviews: 1,
    resume_analyses: 1,
    daily_goals: 1
  }
};

function saveDb() {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
}

function loadDb() {
  if (fs.existsSync(dbFilePath)) {
    try {
      const content = fs.readFileSync(dbFilePath, 'utf8');
      data = JSON.parse(content);
    } catch (e) {
      console.error('Error loading db file, starting fresh:', e);
    }
  }
}

loadDb();

function seedTopicsIfEmpty() {
  if (data.topics.length === 0) {
    console.log("Seeding 150+ placement preparation topics...");

    const dsaTopics = [
      "Arrays", "Strings", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", 
      "Backtracking", "Sorting", "Searching", "Stacks", "Queues", "Heaps", 
      "Hashing", "Greedy", "Sliding Window", "Two Pointers", "Binary Search", 
      "Tries", "Segment Trees", "Bit Manipulation", "Maths", "Divide and Conquer",
      "Matrix", "Hash Table", "String Matching", "Prefix Sum", "Simulation", "Counting", 
      "Design", "Graph Theory", "Shortest Path", "Combinatorics", "Geometry", "Number Theory", 
      "Interactive", "Game Theory", "Data Stream", "Brainteaser", "Randomized", "Monotonic Queue",
      "Merge Sort", "Quick Sort", "Bubble Sort", "Insertion Sort", "Selection Sort",
      "Radix Sort", "Bucket Sort", "Counting Sort", "Topological Sort", "MST",
      "Dijkstra", "Bellman Ford", "Floyd Warshall", "Kruskal", "Prim", "Bipartite Graph",
      "Eulerian Circuit", "Trie", "Suffix Array", "Suffix Tree", "Fenwick Tree",
      "Binary Indexed Tree", "AVL Tree", "Red Black Tree", "B-Tree", "B+ Tree",
      "Skip List", "Fibonacci Heap", "Binomial Heap", "Treap", "Splay Tree"
    ];
    
    const osTopics = [
      "Process Management", "CPU Scheduling", "Deadlocks", "Memory Management", 
      "Virtual Memory", "Paging", "Threading", "Synchronization", "File Systems",
      "Interprocess Communication", "Mutex", "Semaphores", "Monitors", "Banker's Algorithm",
      "Page Replacement Algorithms", "Disk Scheduling", "I/O Hardware", "Interrupts",
      "System Calls", "Kernel", "Thrashing", "Segmentation", "TLB", "Inverted Page Table"
    ];

    const dbmsTopics = [
      "SQL Basics", "Joins", "Normalization", "Transactions", "ACID Properties", 
      "Indexing", "B-Trees", "ER Diagrams", "NoSQL", "Relational Algebra",
      "Keys (Primary, Foreign, Candidate)", "Integrity Constraints", "Views",
      "Triggers", "Stored Procedures", "Concurrency Control", "Locking Protocols",
      "Timestamp Ordering", "Recovery Systems", "Log-Based Recovery",
      "Query Optimization", "Distributed Databases", "Data Warehousing", "Data Mining"
    ];

    const cnTopics = [
      "OSI Model", "TCP/IP Model", "HTTP/HTTPS", "DNS", "Subnetting", 
      "Routing", "TCP vs UDP", "Sockets", "REST", "IP Addressing",
      "IPv4 vs IPv6", "MAC Addresses", "ARP/RARP", "ICMP", "BGP",
      "OSPF", "RIP", "Congestion Control", "Flow Control", "Cryptography Basics",
      "SSL/TLS", "Firewalls", "VPN", "Network Topologies", "Error Detection"
    ];

    const sysDesignTopics = [
      "Load Balancing", "Caching", "Database Sharding", "Microservices", 
      "Message Queues", "CDN", "API Design", "URL Shortener", "Rate Limiting",
      "Consistent Hashing", "CAP Theorem", "PACELC Theorem", "Leader Election",
      "Distributed Caching", "Event Sourcing", "CQRS", "Service Discovery",
      "Chat System Design", "Notification System Design", "Video Streaming Design",
      "Social Media Feed Design", "Ride Sharing App Design", "E-commerce System Design"
    ];

    const behavioralTopics = [
      "Tell Me About Yourself", "Strengths/Weaknesses", "Conflict Resolution", 
      "Leadership", "Teamwork", "Why This Company", "Biggest Challenge",
      "Failure Example", "Time Management", "Handling Pressure",
      "Adaptability", "Communication Skills", "Problem Solving",
      "Initiative", "Career Goals", "Mentorship", "Handling Constructive Criticism"
    ];

    const companiesList = ["Google", "Amazon", "Microsoft", "Flipkart", "TCS", "Infosys", "Wipro", "Meta", "Apple", "Netflix", "Adobe", "Uber", "Swiggy", "Zomato", "Goldman Sachs"];

    const addBatch = (list, category) => {
      list.forEach(name => {
        const difficulty = ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)];
        const numCompanies = Math.floor(Math.random() * 4) + 2;
        const shuffled = [...companiesList].sort(() => 0.5 - Math.random());
        const tags = shuffled.slice(0, numCompanies).join(',');
        
        data.topics.push({
          id: data.autoIds.topics++,
          name,
          category,
          difficulty,
          company_tags: tags
        });
      });
    };

    addBatch(dsaTopics, 'DSA');
    addBatch(osTopics, 'OS');
    addBatch(dbmsTopics, 'DBMS');
    addBatch(cnTopics, 'CN');
    addBatch(sysDesignTopics, 'SystemDesign');
    addBatch(behavioralTopics, 'Behavioral');

    saveDb();
    console.log(`Database seeded with ${data.topics.length} topics!`);
  }
}

seedTopicsIfEmpty();

// Flexible query handler that mimics better-sqlite3
const db = {
  exec: (sql) => {
    // No-op for CREATE TABLE, we initialize in JSON structure
    saveDb();
  },
  prepare: (sql) => {
    const cleanSql = sql.trim().replace(/\s+/g, ' ');

    return {
      get: (...args) => {
        const results = db.prepare(sql).all(...args);
        return results[0] || undefined;
      },
      all: (...args) => {
        // Users queries
        if (cleanSql.includes('FROM users WHERE email =')) {
          const email = args[0];
          return data.users.filter(u => u.email === email);
        }
        if (cleanSql.includes('FROM users WHERE id =')) {
          const id = Number(args[0]);
          return data.users.filter(u => u.id === id);
        }

        // Topics queries
        if (cleanSql.includes('SELECT COUNT(*) as c FROM topics') || cleanSql.includes('SELECT COUNT(*) as count FROM topics')) {
          if (cleanSql.includes('WHERE company_tags LIKE')) {
            const comp = args[0].replace(/%/g, '').trim();
            const count = data.topics.filter(t => t.company_tags && t.company_tags.includes(comp)).length;
            return [{ count, c: count }];
          }
          return [{ count: data.topics.length, c: data.topics.length }];
        }
        if (cleanSql.includes('SELECT company_tags FROM topics')) {
          return data.topics.map(t => ({ company_tags: t.company_tags }));
        }
        if (cleanSql.includes('FROM topics WHERE company_tags LIKE')) {
          const comp = args[0].replace(/%/g, '').trim();
          return data.topics.filter(t => t.company_tags && t.company_tags.includes(comp));
        }
        if (cleanSql.includes('FROM topics WHERE 1=1') || cleanSql.includes('FROM topics')) {
          let res = [...data.topics];
          if (cleanSql.includes('category = ?')) {
            const cat = args[0];
            res = res.filter(t => t.category === cat);
          }
          if (cleanSql.includes('company_tags LIKE ?')) {
            const compParamIndex = cleanSql.includes('category = ?') ? 1 : 0;
            const comp = (args[compParamIndex] || '').replace(/%/g, '').trim();
            res = res.filter(t => t.company_tags && t.company_tags.includes(comp));
          }
          return res;
        }

        // User progress queries
        if (cleanSql.includes('FROM user_progress') && cleanSql.includes('JOIN topics')) {
          const userId = Number(args[0]);
          let userProgs = data.user_progress.filter(p => p.user_id === userId);
          if (cleanSql.includes('p.status = \'completed\'') && cleanSql.includes('company_tags LIKE')) {
            const comp = args[1].replace(/%/g, '').trim();
            userProgs = userProgs.filter(p => {
              const t = data.topics.find(top => top.id === p.topic_id);
              return p.status === 'completed' && t && t.company_tags && t.company_tags.includes(comp);
            });
            return [{ count: userProgs.length }];
          }
          
          return userProgs.map(p => {
            const topic = data.topics.find(t => t.id === p.topic_id) || {};
            return {
              ...p,
              name: topic.name,
              category: topic.category,
              difficulty: topic.difficulty,
              company_tags: topic.company_tags
            };
          });
        }

        if (cleanSql.includes('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND status = ?')) {
          const userId = Number(args[0]);
          const status = args[1];
          const count = data.user_progress.filter(p => p.user_id === userId && p.status === status).length;
          return [{ count }];
        }

        if (cleanSql.includes('FROM user_progress WHERE user_id = ? AND topic_id = ?')) {
          const userId = Number(args[0]);
          const topicId = Number(args[1]);
          return data.user_progress.filter(p => p.user_id === userId && p.topic_id === topicId);
        }

        if (cleanSql.includes('GROUP BY t.category')) {
          const userId = Number(args[0]);
          const categories = ['DSA', 'OS', 'DBMS', 'CN', 'SystemDesign', 'Behavioral'];
          return categories.map(cat => {
            const catTopics = data.topics.filter(t => t.category === cat);
            const total = catTopics.length;
            const completed = catTopics.filter(t => {
              const p = data.user_progress.find(up => up.user_id === userId && up.topic_id === t.id);
              return p && p.status === 'completed';
            }).length;
            return { category: cat, total, completed };
          });
        }

        // Mock interviews queries
        if (cleanSql.includes('FROM mock_interviews WHERE user_id = ? ORDER BY created_at DESC')) {
          const userId = Number(args[0]);
          return data.mock_interviews.filter(m => m.user_id === userId).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        }
        if (cleanSql.includes('FROM mock_interviews WHERE id = ? AND user_id = ?')) {
          const id = Number(args[0]);
          const userId = Number(args[1]);
          return data.mock_interviews.filter(m => m.id === id && m.user_id === userId);
        }

        // Resume analyses queries
        if (cleanSql.includes('FROM resume_analyses WHERE user_id = ? ORDER BY created_at DESC')) {
          const userId = Number(args[0]);
          return data.resume_analyses.filter(r => r.user_id === userId).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        }
        if (cleanSql.includes('FROM resume_analyses WHERE id = ? AND user_id = ?')) {
          const id = Number(args[0]);
          const userId = Number(args[1]);
          return data.resume_analyses.filter(r => r.id === id && r.user_id === userId);
        }

        // Daily goals queries
        if (cleanSql.includes('FROM daily_goals WHERE user_id = ? AND date = ?')) {
          const userId = Number(args[0]);
          const date = args[1];
          return data.daily_goals.filter(g => g.user_id === userId && g.date === date);
        }
        if (cleanSql.includes('FROM daily_goals WHERE user_id = ? ORDER BY date DESC LIMIT 30')) {
          const userId = Number(args[0]);
          return data.daily_goals.filter(g => g.user_id === userId).sort((a,b) => b.date.localeCompare(a.date)).slice(0, 30);
        }

        return [];
      },
      run: (...args) => {
        // INSERT INTO users
        if (cleanSql.includes('INSERT INTO users')) {
          const [name, email, password_hash, college, branch, year, target_companies] = args;
          const id = data.autoIds.users++;
          const newUser = { id, name, email, password_hash, college, branch, year, target_companies, created_at: new Date().toISOString() };
          data.users.push(newUser);
          saveDb();
          return { lastInsertRowid: id, changes: 1 };
        }

        // INSERT / UPDATE user_progress
        if (cleanSql.includes('INSERT INTO user_progress') || cleanSql.includes('UPDATE user_progress')) {
          if (cleanSql.includes('INSERT INTO user_progress')) {
            const [user_id, topic_id, status, confidence, notes, completed_at] = args;
            const existingIdx = data.user_progress.findIndex(p => p.user_id === Number(user_id) && p.topic_id === Number(topic_id));
            if (existingIdx >= 0) {
              data.user_progress[existingIdx] = {
                ...data.user_progress[existingIdx],
                status: status || data.user_progress[existingIdx].status,
                confidence: confidence !== undefined ? confidence : data.user_progress[existingIdx].confidence,
                notes: notes !== undefined ? notes : data.user_progress[existingIdx].notes,
                completed_at: completed_at || data.user_progress[existingIdx].completed_at,
                updated_at: new Date().toISOString()
              };
            } else {
              const id = data.autoIds.user_progress++;
              data.user_progress.push({
                id,
                user_id: Number(user_id),
                topic_id: Number(topic_id),
                status: status || 'not_started',
                confidence: confidence || 0,
                notes: notes || '',
                completed_at: completed_at || null,
                updated_at: new Date().toISOString()
              });
            }
            saveDb();
            return { changes: 1 };
          }
          if (cleanSql.includes('UPDATE user_progress SET status =')) {
            const [status, confidence, notes, completed_at, user_id, topic_id] = args;
            const p = data.user_progress.find(item => item.user_id === Number(user_id) && item.topic_id === Number(topic_id));
            if (p) {
              p.status = status;
              p.confidence = confidence;
              p.notes = notes;
              p.completed_at = completed_at;
              p.updated_at = new Date().toISOString();
            } else {
              const id = data.autoIds.user_progress++;
              data.user_progress.push({
                id,
                user_id: Number(user_id),
                topic_id: Number(topic_id),
                status,
                confidence,
                notes,
                completed_at,
                updated_at: new Date().toISOString()
              });
            }
            saveDb();
            return { changes: 1 };
          }
        }

        // INSERT mock_interviews
        if (cleanSql.includes('INSERT INTO mock_interviews')) {
          const [user_id, type, company, questions_json, answers_json, feedback_json, score] = args;
          const id = data.autoIds.mock_interviews++;
          data.mock_interviews.push({
            id,
            user_id: Number(user_id),
            type,
            company,
            questions_json,
            answers_json,
            feedback_json,
            score,
            created_at: new Date().toISOString()
          });
          saveDb();
          return { lastInsertRowid: id, changes: 1 };
        }

        // INSERT resume_analyses
        if (cleanSql.includes('INSERT INTO resume_analyses')) {
          const [user_id, resume_text, job_description, analysis_json, gaps_json, score] = args;
          const id = data.autoIds.resume_analyses++;
          data.resume_analyses.push({
            id,
            user_id: Number(user_id),
            resume_text,
            job_description,
            analysis_json,
            gaps_json,
            score,
            created_at: new Date().toISOString()
          });
          saveDb();
          return { lastInsertRowid: id, changes: 1 };
        }

        // INSERT / UPDATE daily_goals
        if (cleanSql.includes('INSERT INTO daily_goals')) {
          const [user_id, date, goals_json, completed_count, total_count] = args;
          const id = data.autoIds.daily_goals++;
          data.daily_goals.push({
            id,
            user_id: Number(user_id),
            date,
            goals_json,
            completed_count,
            total_count
          });
          saveDb();
          return { lastInsertRowid: id, changes: 1 };
        }

        if (cleanSql.includes('UPDATE daily_goals SET goals_json =')) {
          const [goals_json, completed_count, id] = args;
          const g = data.daily_goals.find(item => item.id === Number(id));
          if (g) {
            g.goals_json = goals_json;
            g.completed_count = completed_count;
          }
          saveDb();
          return { changes: 1 };
        }

        saveDb();
        return { changes: 1 };
      }
    };
  }
};

module.exports = db;
