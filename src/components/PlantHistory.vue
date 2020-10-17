<template>
  <div class="plant-history">
    <!-- <h1>Value Making Per Hour</h1> -->
    <!-- <TimelineChart -->
    <!--   v-bind:chartData="valuePerHourTimelineData()" -->
    <!--   v-bind:chartOptions="chartOptions(false)" /> -->

    <!-- <h1>Plant Value History</h1> -->
    <!-- <TimelineChart -->
    <!--   v-bind:chartData="totalValueTimelineData()" -->
    <!--   v-bind:chartOptions="chartOptions(true)" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
/*
import {
  StatusHistory,
  Heartbeat,
  Item,
  Bank,
  Inventory,
  Container,
  ContainerSnapshot,
  Chart,
  // Dataset,
  ChartOptions,
  Skills,
  Quests,
  QuestState,
  YAxes,
} from '@/models';
import TimelineChart from '@/components/TimelineChart.vue';

@Component({
  components: { TimelineChart },
})
*/

import { StatusHistory } from '@/models';

@Component
export default class PlantHistory extends Vue {
  @Prop()
  history!: StatusHistory;

  /*
  interpolateContainers(): Container[] {
    let lastBankIndex = 0;
    let lastInventoryIndex = 0;
    let lastLevelsIndex = 0;
    let lastQuestsIndex = 0;
    let lastHeartbeatIndex = 0;

    const bankCount = this.history.banks.length;
    const inventoryCount = this.history.inventories.length;
    const levelsCount = this.history.levels.length;
    const questsCount = this.history.quests.length;

    const firstBank = this.history.banks[0];
    const firstInventory = this.history.inventories[0];
    const firstLevels = this.history.levels[0];
    const firstQuests = this.history.quests[0];
    const firstHeartbeat = this.history.heartbeats[0];

    const states: Container[] = [{
      items: (firstBank?.items ?? []).concat(firstInventory?.items ?? []),
      levels: firstLevels?.skills ?? [],
      quests: firstQuests?.quests ?? new Map(),
      task: firstHeartbeat?.task ?? 'NoTask',
      // eslint-disable-next-line @typescript-eslint/camelcase
      created_at: Math.min(firstQuests?.created_at ?? Number.MAX_VALUE,
        Math.min(firstLevels?.created_at ?? Number.MAX_VALUE,
          Math.min(firstBank?.created_at ?? Number.MAX_VALUE,
            firstInventory?.created_at ?? Number.MAX_VALUE))),
    }];

    while (lastBankIndex < bankCount
      || lastInventoryIndex < inventoryCount
      || lastQuestsIndex < questsCount
      || lastLevelsIndex < levelsCount) {
      const currBank = this.history.banks[lastBankIndex];
      const currInventory = this.history.inventories[lastInventoryIndex];
      const currLevels = this.history.levels[lastLevelsIndex];
      const currQuests = this.history.quests[lastQuestsIndex];
      const currHeartbeat = this.history.heartbeats[lastHeartbeatIndex];

      const nextBank = this.history.banks[lastBankIndex + 1];
      const nextInventory = this.history.inventories[lastInventoryIndex + 1];
      const nextLevels = this.history.levels[lastLevelsIndex + 1];
      const nextQuests = this.history.quests[lastQuestsIndex + 1];
      const nextHeartbeat = this.history.heartbeats[lastHeartbeatIndex + 1];

      const toItems = (container: Bank | Inventory | undefined): Item[] => container?.items ?? [];
      const rightHeartbeat = (
        quests: Quests,
        levels: Skills,
        bank: Bank,
        inventory: Inventory,
        currHeartbeat_: Heartbeat | undefined,
        nextHeartbeat_: Heartbeat | undefined,
      ): Heartbeat | undefined => {
        if (currHeartbeat_ === undefined) {
          return nextHeartbeat_;
        }

        if (nextHeartbeat_ === undefined) {
          return currHeartbeat_;
        }

        if ((quests === undefined || currHeartbeat_.created_at > quests.created_at)
          && (levels === undefined || currHeartbeat_.created_at > levels.created_at)
          && (bank === undefined || currHeartbeat.created_at > bank.created_at)
          && (inventory === undefined || currHeartbeat_.created_at > inventory.created_at)) {
          return currHeartbeat_;
        }

        return nextHeartbeat_;
      };

      if (nextBank === undefined && nextInventory === undefined && nextLevels === undefined) {
        break;
      } else if (nextQuests !== undefined
        && (currQuests.created_at < currLevels.created_at || (nextLevels === undefined
                                                            && nextBank === undefined
                                                            && nextInventory === undefined))) {
        lastQuestsIndex += 1;

        const heartbeat = rightHeartbeat(nextQuests, nextLevels, currBank, currInventory,
          currHeartbeat, nextHeartbeat);
        if (heartbeat === nextHeartbeat && nextHeartbeat !== undefined) lastHeartbeatIndex += 1;
        states.push({
          items: toItems(currInventory).concat(toItems(currBank)),
          quests: nextQuests.quests,
          levels: currLevels.skills,
          task: heartbeat?.task ?? 'NoTask1',
          created_at: currLevels.created_at, // eslint-disable-line @typescript-eslint/camelcase
        });
      } else if (nextLevels !== undefined
        && (currLevels.created_at < currBank.created_at || (nextBank === undefined
                                                            && nextInventory === undefined))) {
        lastLevelsIndex += 1;

        const heartbeat = rightHeartbeat(nextQuests, nextLevels, currBank, currInventory,
          currHeartbeat, nextHeartbeat);
        if (heartbeat === nextHeartbeat && nextHeartbeat !== undefined) lastHeartbeatIndex += 1;
        states.push({
          items: toItems(currInventory).concat(toItems(currBank)),
          levels: nextLevels.skills,
          quests: currQuests.quests,
          task: heartbeat?.task ?? 'NoTask2',
          created_at: currBank.created_at, // eslint-disable-line @typescript-eslint/camelcase
        });
      } else if (nextBank !== undefined
        && (currBank.created_at < currInventory.created_at || nextInventory === undefined)) {
        lastBankIndex += 1;

        const heartbeat = rightHeartbeat(nextQuests, nextLevels, currBank, currInventory,
          currHeartbeat, nextHeartbeat);
        if (heartbeat === nextHeartbeat && nextHeartbeat !== undefined) lastHeartbeatIndex += 1;
        states.push({
          items: toItems(currInventory).concat(toItems(nextBank)),
          levels: currLevels.skills,
          quests: currQuests.quests,
          task: heartbeat?.task ?? 'NoTask3',
          created_at: currInventory.created_at, // eslint-disable-line @typescript-eslint/camelcase
        });
      } else if (nextInventory !== undefined) {
        lastInventoryIndex += 1;

        const heartbeat = rightHeartbeat(nextQuests, nextLevels, currBank, currInventory,
          currHeartbeat, nextHeartbeat);
        if (heartbeat === nextHeartbeat && nextHeartbeat !== undefined) lastHeartbeatIndex += 1;
        states.push({
          items: toItems(currBank).concat(toItems(nextInventory)),
          levels: currLevels.skills,
          quests: currQuests.quests,
          task: heartbeat?.task ?? 'NoTask4',
          created_at: currBank.created_at, // eslint-disable-line @typescript-eslint/camelcase
        });
      } else {
        break;
      }
    }

    return states;
  }

  groupByMinutes(minutes: number, containers: Container[]): ContainerSnapshot[] {
    const newContainers: ContainerSnapshot[] = [];
    let containersGroup: Container[] = [];

    for (const container of containers) {
      if (containersGroup.length === 0) {
        containersGroup.push(container);
      } else if (containersGroup[0].task === container.task
        && container.created_at - containersGroup[0].created_at < minutes * 60) {
        containersGroup.push(container);
      } else {
        let value = 0;
        for (const c of containersGroup) {
          value += this.totalValue(c.items);
        }
        value /= containersGroup.length;

        let totalLevel = 0;
        for (const c of containersGroup) {
          totalLevel += c.levels.reduce((acc, lvl) => acc + lvl.value, 0);
        }
        totalLevel /= containersGroup.length;

        const questPointsDict: Map<number, number> = new Map();
        for (const c of containersGroup) {
          const points = Array.from(Object.values(c.quests))
            .filter((q) => q.state === QuestState.Complete)
            .reduce((acc, quest) => acc + quest.points, 0);
          questPointsDict.set(points, (questPointsDict.get(points) ?? 0) + 1);
        }
        let maxCount = 0;
        let questPoints = 0;
        for (const [points, count] of questPointsDict.entries()) {
          if (count > maxCount) {
            questPoints = points;
            maxCount = count;
          }
        }

        newContainers.push({
          value,
          totalLevel,
          questPoints,
          count: containersGroup.length,
          task: containersGroup[0].task,
          // eslint-disable-next-line @typescript-eslint/camelcase
          created_at: containersGroup[0].created_at,
        });
        containersGroup = [];
      }
    }

    if (containersGroup.length !== 0) {
      let value = 0;
      for (const c of containersGroup) {
        const v = this.totalValue(c.items);
        value += v;
      }
      value /= containersGroup.length;

      let totalLevel = 0;
      for (const c of containersGroup) {
        totalLevel += c.levels.reduce((acc, lvl) => acc + lvl.value, 0);
      }
      totalLevel /= containersGroup.length;

      const questPointsDict: Map<number, number> = new Map();
      for (const c of containersGroup) {
        const points = Array.from(Object.values(c.quests))
          .filter((q) => q.state === QuestState.Complete)
          .reduce((acc, quest) => acc + quest.points, 0);
        questPointsDict.set(points, (questPointsDict.get(points) ?? 0) + 1);
      }
      let maxCount = 0;
      let questPoints = 0;
      for (const [points, count] of questPointsDict.entries()) {
        if (count > maxCount) {
          questPoints = points;
          maxCount = count;
        }
      }

      newContainers.push({
        value,
        totalLevel,
        questPoints,
        task: containersGroup[0].task,
        count: containersGroup.length,
        // eslint-disable-next-line @typescript-eslint/camelcase
        created_at: containersGroup[0].created_at,
      });
    }

    // Removes tasks that were run for less than 3 minutes to avoid clutter
    const cleanedContainers = [];
    for (const container of newContainers) {
      if (container.count > 3) {
        cleanedContainers.push(container);
      }
    }
    return cleanedContainers;
  }

  // eslint-disable-next-line class-methods-use-this
  chartOptions(multiAxis: boolean): ChartOptions {
    const yAxes: YAxes[] = [{
      type: 'linear',
      id: 'money',
      position: 'left',
      ticks: {
        callback: (value: number): string => this.formatMoney(value),
        min: 0,
      },
    }];

    if (multiAxis) {
      yAxes.push({
        type: 'linear',
        id: 'levels',
        position: 'right',
        ticks: {
          callback: (value: number): string => value.toString(),
          min: 32,
          max: 100,
        },
      });
      yAxes.push({
        type: 'linear',
        id: 'quests',
        position: undefined,
        ticks: {
          callback: (value: number): string => value.toString(),
          min: 0,
          max: 10,
        },
      });
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: { yAxes },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  totalValueTimelineData(): Chart {
    const minutes = 60;
    const containers = this.groupByMinutes(minutes, this.interpolateContainers());
    const startingDate = containers
      .map((c) => c.created_at)
      .reduce((acc, val) => Math.min(acc, val));
    return {
      labels: containers
        .map((c) => `${Math.floor((c.created_at - startingDate) / 60 / minutes)} - ${c.task}`),
      datasets: [{
        label: 'Total Value',
        yAxisID: 'money',
        backgroundColor: '#f87979',
        data: containers.map((c) => Math.floor(c.value)),
      }, {
        label: 'Total Level',
        yAxisID: 'levels',
        backgroundColor: 'blue',
        data: containers.map((c) => Math.floor(c.totalLevel)),
      }, {
        label: 'Quest Points',
        yAxisID: 'quests',
        backgroundColor: 'green',
        data: containers.map((c) => Math.floor(c.questPoints)),
      }],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  valuePerHourTimelineData(): Chart {
    const minutes = 60;
    let containers = this.groupByMinutes(minutes, this.interpolateContainers());
    const startingDate = containers
      .map((c) => c.created_at)
      .reduce((acc, val) => Math.min(acc, val));

    let lastContainer: undefined | ContainerSnapshot;
    containers = containers.map((container) => {
      const ret = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        created_at: container.created_at,
        totalLevel: container.totalLevel,
        questPoints: container.questPoints,
        count: container.count,
        task: container.task,
        value: container.value - (lastContainer?.value ?? 0),
      };
      lastContainer = container;
      return ret;
    });

    return {
      labels: containers
        .map((c) => `${Math.floor((c.created_at - startingDate) / 60 / minutes)} - ${c.task}`),
      datasets: [{
        label: 'Per Hour',
        yAxisID: 'money',
        backgroundColor: '#f87979',
        data: containers.map((c) => Math.floor(c.value)),
      }],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private totalValue(items: Item[]): number {
    return items.map((item) => item.quantity * item.individual_price)
      .reduce((acc, val) => acc + val, 0);
  }

  // eslint-disable-next-line class-methods-use-this
  private formatMoney(money: number): string {
    let ret = money.toString();
    if (money >= 1_000_000) {
      const num = (money / 1_000_000).toFixed(2);
      ret = `${num}M`;
    } else if (money >= 1_000) {
      const num = (money / 1_000).toFixed(1);
      ret = `${num}K`;
    }
    return ret;
  }
  */
}
</script>
