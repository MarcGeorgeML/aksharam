import torch
import torch.nn as nn
import torch.nn.functional as F


class ConvNet(nn.Module):
    def __init__(self, num_classes=49):
        super(ConvNet, self).__init__()

        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.AvgPool2d(2, 2)

        self.conv2 = nn.Conv2d(6, 16, 5)
        self.pool = nn.AvgPool2d(2, 2)

        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, num_classes)  # num_classes is now dynamic

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 16 * 5 * 5)  # Flatten the tensor
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)  # No activation function since it's handled by loss function

        return x



"""
import torch
import torch.nn as nn
import torch.nn.functional as F

class ConvNet(nn.Module):
    def __init__(self, num_classes=49):
        super(ConvNet, self).__init__()

        if num_classes == 49:
            # Architecture for num_classes = 49
            self.conv1 = nn.Conv2d(3, 6, 5)
            self.conv2 = nn.Conv2d(6, 16, 5)
            fc1_input_size = 16 * 5 * 5
            self.fc1 = nn.Linear(fc1_input_size, 120)
            self.fc2 = nn.Linear(120, 84)
            self.fc3 = nn.Linear(84, num_classes)

        elif num_classes == 11:
            # Architecture for num_classes = 11
            self.conv1 = nn.Conv2d(3, 4, 5)
            self.conv2 = nn.Conv2d(4, 8, 5)
            fc1_input_size = 8 * 5 * 5
            self.fc1 = nn.Linear(fc1_input_size, 120)
            self.fc2 = nn.Linear(120, 60)
            self.fc3 = nn.Linear(60, num_classes)

        else:
            raise ValueError("Unsupported num_classes value. Use 49 or 11.")

        self.pool = nn.AvgPool2d(2, 2)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, self.fc1.in_features)  # Ensure correct flattening
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x
"""