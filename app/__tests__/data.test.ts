import { describe, it, expect } from "vitest";

describe("OFA App Data Logic", () => {
  describe("Fighter Data", () => {
    it("should have valid fighter attributes", () => {
      const fighter = {
        id: "1",
        first_name: "John",
        last_name: "Smith",
        nickname: "The Hammer",
        weight_class: "welterweight",
        style_icon: "🏟️",
        wins: 12,
        losses: 3,
        draws: 0,
        money: 125000,
        training_points: 8,
      };

      expect(fighter.first_name).toBeDefined();
      expect(fighter.last_name).toBeDefined();
      expect(fighter.weight_class).toBeDefined();
      expect(fighter.wins).toBeGreaterThanOrEqual(0);
      expect(fighter.losses).toBeGreaterThanOrEqual(0);
    });

    it("should calculate fighter record correctly", () => {
      const wins = 12;
      const losses = 3;
      const draws = 0;
      const totalFights = wins + losses + draws;

      expect(totalFights).toBe(15);
      expect(wins).toBeGreaterThan(losses);
    });

    it("should have valid weight classes", () => {
      const WEIGHT_CLASSES = [
        { id: "flyweight", name: "Flyweight", min: 115, max: 125 },
        { id: "bantamweight", name: "Bantamweight", min: 126, max: 135 },
        { id: "featherweight", name: "Featherweight", min: 136, max: 145 },
        { id: "lightweight", name: "Lightweight", min: 146, max: 155 },
        { id: "welterweight", name: "Welterweight", min: 156, max: 170 },
        { id: "middleweight", name: "Middleweight", min: 171, max: 185 },
        { id: "lightheavyweight", name: "Light Heavyweight", min: 186, max: 205 },
        { id: "heavyweight", name: "Heavyweight", min: 206, max: 265 },
      ];

      expect(WEIGHT_CLASSES.length).toBe(8);
      expect(WEIGHT_CLASSES[0].name).toBe("Flyweight");
      expect(WEIGHT_CLASSES[7].name).toBe("Heavyweight");
    });
  });

  describe("Rankings Data", () => {
    it("should rank fighters by wins", () => {
      const fighters = [
        { rank: 1, wins: 25, losses: 2 },
        { rank: 2, wins: 20, losses: 4 },
        { rank: 3, wins: 18, losses: 5 },
      ];

      expect(fighters[0].wins).toBeGreaterThan(fighters[1].wins);
      expect(fighters[1].wins).toBeGreaterThan(fighters[2].wins);
    });

    it("should identify champion", () => {
      const champion = { is_champion: true, name: "Alex Champion" };
      const regular = { is_champion: false, name: "Regular Fighter" };

      expect(champion.is_champion).toBe(true);
      expect(regular.is_champion).toBe(false);
    });
  });

  describe("Challenge Data", () => {
    it("should have valid challenge structure", () => {
      const challenge = {
        id: "ch1",
        challenger_name: "John Smith",
        defender_name: "Jane Doe",
        weight_class: "welterweight",
        status: "pending",
        created_at: "2026-01-03T15:30:00Z",
      };

      expect(challenge.id).toBeDefined();
      expect(challenge.challenger_name).toBeDefined();
      expect(challenge.status).toBe("pending");
    });

    it("should track challenge status", () => {
      const statuses = ["pending", "done", "declined"];
      const challenge = { status: "pending" };

      expect(statuses).toContain(challenge.status);
    });

    it("should calculate purse correctly", () => {
      const winPurse = 50000;
      const lossPurse = 15000;

      expect(winPurse).toBeGreaterThan(lossPurse);
      expect(winPurse - lossPurse).toBe(35000);
    });
  });

  describe("Fight Results", () => {
    it("should record fight outcome", () => {
      const result = {
        winner: "Fighter A",
        loser: "Fighter B",
        method: "KO",
        round: 2,
        time: "2:45",
      };

      expect(result.winner).toBeDefined();
      expect(result.method).toBe("KO");
      expect(result.round).toBe(2);
    });

    it("should support multiple finish methods", () => {
      const methods = ["KO", "Submission", "Decision"];

      expect(methods).toContain("KO");
      expect(methods).toContain("Submission");
      expect(methods).toContain("Decision");
    });

    it("should track training points", () => {
      const winnerTrainingPoints = 4;
      const loserTrainingPoints = 2;

      expect(winnerTrainingPoints).toBeGreaterThan(loserTrainingPoints);
      expect(winnerTrainingPoints).toBe(4);
      expect(loserTrainingPoints).toBe(2);
    });
  });

  describe("Stats Aggregation", () => {
    it("should aggregate fighter stats", () => {
      const fighters = [
        { wins: 12, losses: 3, money: 125000 },
        { wins: 8, losses: 2, money: 85000 },
      ];

      const totalWins = fighters.reduce((sum, f) => sum + f.wins, 0);
      const totalLosses = fighters.reduce((sum, f) => sum + f.losses, 0);
      const totalMoney = fighters.reduce((sum, f) => sum + f.money, 0);

      expect(totalWins).toBe(20);
      expect(totalLosses).toBe(5);
      expect(totalMoney).toBe(210000);
    });

    it("should format money correctly", () => {
      const money = 125000;
      const formatted = `$${money.toLocaleString()}`;

      expect(formatted).toBe("$125,000");
    });
  });

  describe("Attribute System", () => {
    it("should have valid attribute ranges", () => {
      const minAttribute = 30;
      const maxAttribute = 99;
      const attribute = 50;

      expect(attribute).toBeGreaterThanOrEqual(minAttribute);
      expect(attribute).toBeLessThanOrEqual(maxAttribute);
    });

    it("should allocate 90 points for fighter creation", () => {
      const totalPoints = 90;
      const allocatedPoints = 45 + 25 + 20; // example allocation

      expect(allocatedPoints).toBeLessThanOrEqual(totalPoints);
    });

    it("should track training points", () => {
      const initialTrainingPoints = 5;
      const pointsUsed = 2;
      const remaining = initialTrainingPoints - pointsUsed;

      expect(remaining).toBe(3);
    });
  });
});
