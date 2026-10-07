# EASG project assets

This folder is the single source of truth for the project-page visuals.

## Existing paper figures

- `teaser.svg` — hero and overview teaser
- `method.svg` — method overview
- `zeroshot_curve.svg` — data-efficiency curve
- `finetuning_demo.svg` — fine-tuning result figure
- `cross_embodiment_settings.svg` / `cross_demo.svg` — cross-embodiment slots
- `ablation_frame.svg` — action grounding ablation figure
- `RealSceneSetup.svg` — real-world setup
- `real_objects.svg` — task screenshots for capability-boundary hover cards
- `zero_shot_representation.svg` — zero-shot action representation figure

## Where to drop videos

Create the following folders and use the suggested filenames. The current page intentionally renders a lightweight placeholder until clips are supplied.

```text
assets/project/videos/
├── zero-shot/
│   ├── rigid-1.1.1.mp4
│   ├── rigid-1.1.2.mp4
│   ├── rigid-1.1.3.mp4
│   ├── articulated-1.2.1.mp4
│   ├── articulated-1.2.2.mp4
│   └── deformable-1.3.mp4
├── finetune/
│   ├── task-2.1-ours.mp4
│   ├── task-2.2-ours.mp4
│   ├── task-2.3.1-ours.mp4
│   ├── task-2.3.2-ours.mp4
│   ├── task-2.4.1-ours.mp4
│   └── task-2.4.2-ours.mp4
└── cross-embodiment/
    ├── task-2.1-ur3-exterior.mp4
    ├── task-2.1-wrist.mp4
    ├── task-2.1-flexiv-exterior.mp4
    └── ...
```

`star.svg` is the current action-frame mark used by the intro and favicon, converted from `star.pdf`. Replace that file with the final project icon when it is available; no HTML changes are needed.
