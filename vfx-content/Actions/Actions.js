import { getID } from "../../vfx-metaverse";

export let Actions = [
  {
    name: "Standing Waiting",
    url: `/rpm/rpm-pose/standing-waiting.fbx`,
  },
  {
    name: "Cheering",
    url: `/rpm/rpm-actions/cheer.fbx`,
  },
  {
    name: "Excited",
    url: `/rpm/rpm-actions/excited.fbx`,
  },
  {
    name: "BackFlip",
    url: `/rpm/rpm-actions/backflip.fbx`,
  },
  {
    name: "Bow, Quick and Formal",
    url: `/rpm/rpm-actions/bow-quick-formal.fbx`,
  },
  {
    name: "Hip Hop Dance",
    url: `/rpm/rpm-actions/dance-hiphop.fbx`,
  },
  {
    name: "Greetings",
    url: `/rpm/rpm-actions/greetings.fbx`,
  },
  {
    name: "Pointer 2",
    url: `/rpm/rpm-actions/guesture-pointer-2.fbx`,
  },
  {
    name: "Pointer",
    url: `/rpm/rpm-actions/guesture-pointer.fbx`,
  },
  {
    name: "Hand Fowrad",
    url: `/rpm/rpm-actions/hand-forward.fbx`,
  },
  {
    name: "Happy Hand",
    url: `/rpm/rpm-actions/happy-hand.fbx`,
  },
  {
    name: "Happy Idle",
    url: `/rpm/rpm-actions/happy-idle.fbx`,
  },
  {
    name: "Double Wavy",
    url: `/rpm/rpm-actions/hi-wave-both-hands.fbx`,
  },
  {
    name: "MMA Idle",
    url: `/rpm/rpm-actions/mma-idle.fbx`,
  },
  {
    name: "MMA Kick",
    url: `/rpm/rpm-actions/mma-kick.fbx`,
  },
  {
    name: "MMA Kick 2",
    url: `/rpm/rpm-actions/mma-kick-2.fbx`,
  },
  {
    name: "MMA Warmup",
    url: `/rpm/rpm-actions/mma-warmup.fbx`,
  },
  {
    name: "Silly Dance",
    url: `/rpm/rpm-actions/silly-dance.fbx`,
  },
  {
    name: "Spin in Place",
    url: `/rpm/rpm-actions/spin-in-place.fbx`,
  },
  {
    name: "Hip Hop Dancing",
    url: `/rpm/rpm-actions-locomotion/hip-hop-dancing.fbx`,
  },
  {
    name: "Standing",
    url: `/rpm/rpm-pose/standing.fbx`,
  },
]
  .map((e) => {
    e.id = getID();
    return e;
  })
  .filter((e) => e.name);
